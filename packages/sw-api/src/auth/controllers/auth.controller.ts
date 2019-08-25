import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	ParseIntPipe,
	Post,
	Query,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthService, Tokens } from '@api/auth/services/auth.service';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { LocalAuthGuard } from '@api/auth/guards/local.guard';
import { AuthenticatedGuard } from '@api/auth/guards/authenticated.guard';
import { RefreshTokenGuard } from '@api/auth/guards/refresh-token.guard';
import { ApiCreatedResponse, ApiImplicitParam, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { AuthorizedApiOperation } from '@api/core/decorators/api-doc';
import { getValidationPipe } from '@api/core/pipe/validation';
import passport from 'passport';
import { TokenService } from '@api/auth/services/token.service';
import { isBefore } from 'date-fns';
import { TokenType } from '@schema/auth/models/enums/token-type.token';
import { UserService } from '@api/user/services/user.service';
import { User } from '@schema/user/models/user.entity';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly tokenService: TokenService,
		private readonly userService: UserService
	) {}

	@ApiCreatedResponse({ description: 'User has been created', type: Tokens })
	@ApiOperation({ title: 'Sign up endpoint' })
	@Post('signup')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(AuthenticatedGuard)
	public signUp(
		@Body(getValidationPipe())
		user: CreateUserDto
	) {
		return this.authService.signUp(user);
	}

	@ApiCreatedResponse({ description: 'User email has been verified', type: Tokens })
	@ApiOperation({ title: 'Verify email endpoint' })
	@Get('verify_email')
	@HttpCode(HttpStatus.OK)
	public async verifyEmail(
		@Query('token') verificationCode: string,
		@Query('user', new ParseIntPipe())
		userId: number
	) {
		const token = await this.tokenService.findOne({
			content: verificationCode,
			type: TokenType.CONFIRM_EMAIL,
			engagementId: userId,
		});
		if (!token || isBefore(token.ttl, new Date())) {
			throw new BadRequestException('Token does not exist or has expired');
		}
		const user = await this.userService.activateUser(userId);
		await this.tokenService.remove(token);
		return this.authService.createTokens(user);
	}

	@ApiImplicitParam({ name: 'username', type: String })
	@ApiImplicitParam({ name: 'password', type: String })
	@ApiOkResponse({ description: 'User has logged in successfully', type: Tokens })
	@ApiOperation({ title: 'Log in endpoint' })
	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthenticatedGuard, LocalAuthGuard)
	public login(@Req() req) {
		return this.authService.createTokens(req.user);
	}

	@ApiOkResponse({ description: 'A new refresh token has been created', type: Tokens })
	@AuthorizedApiOperation({ title: 'Refresh token endpoint' })
	@Post('refresh_token')
	@HttpCode(HttpStatus.OK)
	@UseGuards(RefreshTokenGuard)
	public refreshToken(@Req() req) {
		return this.authService.createTokens(req.user);
	}

	@Get('facebook')
	@UseGuards(AuthenticatedGuard)
	public facebookAuth(@Req() req, @Res() res) {
		const referrer = req.get('Referrer') || '';
		passport.authenticate('facebook', {
			scope: ['email'],
			callbackURL: `${referrer}/auth/facebook/callback`,
		})(req, res);
	}

	@Get('facebook/callback')
	@UseGuards(AuthenticatedGuard)
	public facebookCallback(@Req() req) {
		return this.authService.createTokens(req.user);
	}

	@Get('google')
	@UseGuards(AuthenticatedGuard)
	public googleAuth(@Req() req, @Res() res) {
		const referrer = req.get('Referrer') || '';
		passport.authenticate('google', {
			scope: ['profile', 'email'],
			callbackURL: `${referrer}/auth/google/callback`,
		})(req, res);
	}

	@Get('google/callback')
	@UseGuards(AuthenticatedGuard)
	public googleCallback(@Req() req) {
		return this.authService.createTokens(req.user);
	}
}
