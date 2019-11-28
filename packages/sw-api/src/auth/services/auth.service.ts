import { BadRequestException, Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { CryptoService } from '@api/auth/services/crypto.service';
import { UserService } from '@api/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@schema/user/models/user.entity';
import uuid from 'uuid/v4';
import { Provider } from 'nconf';
import { EmailService } from '@api/email/email.service';
import { ApiModelProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer-imp';
import { SocialProfileDto } from '@shared/lib/dtos/user/social-profile.dto';
import { SocialProvider } from '@shared/lib/dtos/user/enum/social-provider.enum';
import { TokenService } from '@api/auth/services/token.service';
import { CompleteSocialProfileDto } from '@shared/lib/dtos/user/complete-social-profile.dto';
import { TokenType } from '@schema/auth/models/enums/token-type.token';
import { ResetPasswordDto } from '@shared/lib/dtos/user/reset-password-dto';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { API_CONFIG } from '@core/config/config.constants';

export class Tokens {
	@ApiModelProperty() accessToken: string;

	@ApiModelProperty() refreshToken: string;
}

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly cryptoService: CryptoService,
		private readonly jwtService: JwtService,
		private readonly tokenService: TokenService,
		private readonly emailService: EmailService,
		@Inject(API_CONFIG) private readonly config: Provider
	) {}

	public async signUp(createUserDto: CreateUserDto): Promise<Tokens> {
		createUserDto['role'] = UserRole.USER;
		createUserDto['status'] = UserStatus.PENDING;
		const userValues = plainToClass(User, createUserDto);
		const user = await this.userService.saveOne(userValues);
		await this.tokenService.createVerifyEmailToken(user);
		await this.emailService.sendUserVerificationEmail(user);
		return this.createTokens(user);
	}

	public async completeSocialProfile(user: User, completeSocialProfile: CompleteSocialProfileDto): Promise<Tokens> {
		user.password = completeSocialProfile.password;
		user.username = completeSocialProfile.username;
		user.status = UserStatus.ACTIVE;
		user = await this.userService.saveOne(user);
		return this.createTokens(user);
	}

	public async resendVerificationEmail(email: string): Promise<void> {
		const user = await this.userService.findOne({ email });
		if (!user) {
			throw new NotFoundException(`User with email ${email} cannot be found`);
		}

		// Delete token dedicated for previous verification email
		// Make sure only one verification email is valid at a time
		await this.tokenService.delete({
			engagementTable: this.userService.getTableName(),
			engagementId: user.id,
			type: TokenType.CONFIRM_EMAIL,
		});

		// Regenerate and resend verification email
		await this.tokenService.createVerifyEmailToken(user);
		await this.emailService.sendUserVerificationEmail(user);
	}

	public async sendForgotPasswordEmail(email: string): Promise<void> {
		const user = await this.userService.findOne({ email });
		if (!user) {
			throw new NotFoundException(`User with email ${email} cannot be found`);
		}
		await this.tokenService.delete({
			engagementTable: this.userService.getTableName(),
			engagementId: user.id,
			type: TokenType.FORGOT_PASSWORD,
		});
		await this.tokenService.createForgotPasswordToken(user);
		await this.emailService.sendForgotPasswordEmail(user);
	}

	public async createTokens(user: User): Promise<Tokens> {
		const refreshToken = await this.createRefreshToken(user);
		const accessToken = this.createAccessToken(user);

		return { accessToken, refreshToken };
	}

	public async logIn(username, password) {
		const user = await this.userService.findOne({ username });
		if (!user) {
			throw new NotFoundException(`User with username ${username} cannot be found`);
		}
		if (!(await this.cryptoService.comparePassword(password, user.password))) {
			throw new BadRequestException('Incorrect password');
		}
		return user;
	}

	public async verify(payload) {
		if (!(payload.user && payload.user.id)) {
			throw new UnauthorizedException('User not found');
		}
		const user = await this.userService.findById({ id: payload.user.id, cache: true });
		if (!user) {
			throw new UnauthorizedException('Invalid token');
		}
		//if token is created before the user is updated, mark it as invalid
		if (user.updatedAt.getTime() - payload.iat * 1000 > 1000) {
			throw new TokenExpiredError('Token expired', user.updatedAt.getTime() / 1000);
		}
		return user;
	}

	public async socialSignin(socialProvider: SocialProvider, profile: SocialProfileDto) {
		let user = await this.userService.findBySocialId(profile.id);
		if (user) {
			return user;
		}

		const usernameCount = await this.userService.count({
			where: {
				username: profile.username,
			},
		});

		let username = profile.username;

		if (usernameCount > 0) {
			username += '-' + usernameCount;
		}

		user = plainToClass(User, {
			firstName: profile.firstName,
			lastName: profile.lastName,
			username,
			email: profile.email,
			password: uuid(),
			socialProvider,
			socialId: profile.id,
		});

		return await this.userService.saveOne(user);
	}

	public async resetPassword(userId: number, resetPasswordDto: ResetPasswordDto) {
		await this.tokenService.delete({
			engagementTable: this.userService.getTableName(),
			engagementId: userId,
			type: TokenType.FORGOT_PASSWORD,
		});

		const user = await this.userService.findById({ id: userId });
		if (!user) {
			throw new BadRequestException(`User with id ${userId} cannot be found`);
		}
		user.password = resetPasswordDto.password;
		await this.userService.saveOne(user);

		return this.createTokens(user);
	}

	public async clearTokens(user: User) {
		user.refreshToken = undefined;
		return this.userService.saveOne(user);
	}

	private createAccessToken(user: User) {
		const id = user.id;
		return this.jwtService.sign({
			user: {
				id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				username: user.username,
				name: user.name,
				status: user.status,
				socialProvider: user.socialProvider,
			},
		});
	}

	private async createRefreshToken(user: User): Promise<string> {
		let refreshToken = user.refreshToken as string;
		let needsNewToken;
		if (refreshToken) {
			const decodedPayload: any = this.jwtService.decode(refreshToken);
			const exp = decodedPayload.exp;
			if (exp * 1000 < Date.now()) {
				needsNewToken = true;
			}
		} else {
			needsNewToken = true;
		}
		if (needsNewToken) {
			refreshToken = jwt.sign(
				{
					id: user.id,
				},
				this.config.get('auth:jwt:secret_key'),
				{ expiresIn: this.config.get('auth:jwt:refresh_token_expiration_time') }
			);
			user.refreshToken = refreshToken;
			await this.userService.saveOne(user);
		}

		return refreshToken;
	}
}
