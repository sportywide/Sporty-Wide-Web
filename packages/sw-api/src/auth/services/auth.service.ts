import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { CryptoService } from '@api/auth/services/crypto.service';
import { UserService } from '@api/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@schema/user/models/user.entity';
import uuid from 'uuid/v4';
import { EmailService } from '@api/email/email.service';
import { ApiModelProperty } from '@nestjs/swagger';

export class Tokens {
	@ApiModelProperty()
	accessToken: string;

	@ApiModelProperty()
	refreshToken: string;
}

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly cryptoService: CryptoService,
		private readonly jwtService: JwtService,
		private readonly emailService: EmailService
	) {}

	public async signUp(createUserDto: CreateUserDto): Promise<Tokens> {
		createUserDto['role'] = UserRole.USER;
		createUserDto['status'] = UserStatus.PENDING;
		const user = await this.userService.create(createUserDto);
		await this.emailService.sendUserVerificationEmail(user);
		return this.createTokens(user);
	}

	public async createTokens(user: User): Promise<Tokens> {
		const accessToken = this.createAccessToken(user);
		const refreshToken = await this.createRefreshToken(user);

		return { accessToken, refreshToken };
	}

	private createAccessToken(user: User) {
		const id = user.get('id');
		return this.jwtService.sign({
			sub: id,
			user: {
				id,
				email: user.get('email'),
				firstName: user.get('firstName'),
				lastName: user.get('lastName'),
			},
		});
	}

	public async logIn(email, password) {
		const user = await this.userService.findOne({ where: { email } });
		if (!user) {
			throw new NotFoundException(`User with email ${email} cannot be found`);
		}
		if (!this.cryptoService.comparePassword(password, user.get('password'))) {
			throw new BadRequestException('Incorrect password');
		}
		return user;
	}

	public async verify(payload) {
		const user = await this.userService.findOne({ where: { id: payload.sub } });
		if (!user) {
			throw new UnauthorizedException('Invalid token');
		}
		return user;
	}

	public async clearTokens(user: User) {
		return user.set('refreshToken', null).save();
	}

	private async createRefreshToken(user) {
		const refreshToken = uuid();
		await user.set('refreshToken', refreshToken).save();

		return refreshToken;
	}
}
