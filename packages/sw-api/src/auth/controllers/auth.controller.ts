import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService, Tokens } from '@api/auth/services/auth.service';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { LocalAuthGuard } from '@api/auth/guards/local.guard';
import { AuthenticatedGuard } from '@api/auth/guards/authenticated.guard';
import { RefreshTokenGuard } from '@api/auth/guards/refresh-token.guard';
import { EmailService } from '@api/email/email.service';
import { ApiCreatedResponse, ApiImplicitParam, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { AuthorizedApiOperation } from '@api/core/decorators/api-doc';
import { getValidationPipe } from '@api/core/pipe/validation';
import passport from 'passport';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private emailService: EmailService) {}

	@ApiCreatedResponse({ description: 'User has been created', type: Tokens })
	@ApiOperation({ title: 'Sign up endpoint' })
	@Post('signup')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(AuthenticatedGuard)
	public signUp(@Body(getValidationPipe()) user: CreateUserDto) {
		return this.authService.signUp(user);
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
	public facebookAuth(@Req() req, @Res() res) {
		const referrer = req.get('Referrer') || '';
		passport.authenticate('facebook', {
			scope: ['email'],
			callbackURL: `${referrer}/auth/facebook/callback`,
		})(req, res);
	}

	@Get('facebook/callback')
	public facebookCallback(@Req() req) {
		return this.authService.createTokens(req.user);
	}

	@Get('google')
	public googleAuth(@Req() req, @Res() res) {
		const referrer = req.get('Referrer') || '';
		passport.authenticate('google', {
			scope: ['profile', 'email'],
			callbackURL: `${referrer}/auth/google/callback`,
		})(req, res);
	}

	@Get('google/callback')
	public googleCallback(@Req() req) {
		return this.authService.createTokens(req.user);
	}
}
