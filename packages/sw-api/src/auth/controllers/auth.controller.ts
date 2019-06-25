import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards, Get } from '@nestjs/common';
import { AuthService } from '@api/auth/services/auth.service';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { LocalAuthGuard } from '@api/auth/guards/local.guard';
import { COOKIE_CSRF, COOKIE_JWT_PAYLOAD, COOKIE_JWT_SIGNATURE, COOKIE_REFRESH_TOKEN } from '@api/auth/constants';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { AuthenticatedGuard } from '@api/auth/guards/authenticated.guard';
import { getValidationPipe } from '@api/core/pipe/validation';
import { User } from '@api/core/decorators/user';
import { RefreshTokenGuard } from '@api/auth/guards/refresh-token.guard';
import { EmailService } from '@api/email/email.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private emailService: EmailService) {}

	@Post('signup')
	@UseGuards(AuthenticatedGuard)
	public async signUp(
		@Body(getValidationPipe())
		user: CreateUserDto,
		@Req() req,
		@Res() res
	) {
		const tokens = await this.authService.signUp(user);
		this.setCookies({ tokens, res, req });
		res.send(tokens);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthenticatedGuard, LocalAuthGuard)
	public async login(@Req() req, @Res() res) {
		const tokens = await this.authService.createTokens(req.user);
		this.setCookies({ tokens, res, req });
		res.send(tokens);
	}

	@Post('refresh_token')
	@HttpCode(HttpStatus.OK)
	@UseGuards(RefreshTokenGuard)
	public async refreshToken(@Req() req, @Res() res) {
		const tokens = await this.authService.createTokens(req.user);
		this.setCookies({ tokens, res, req });
		res.send(tokens);
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	public async logout(@User() user, @Req() req, @Res() res) {
		this.clearCookie(req, res);
		this.authService.clearTokens(user);
		res.send();
	}

	private setCookies({ tokens: { refreshToken, accessToken }, req, res }) {
		const isProduction = process.env.NODE_ENV === 'production';
		const [header, payload, signature] = accessToken.split('.');

		res.cookie(COOKIE_JWT_PAYLOAD, [header, payload].join('.'), {
			secure: isProduction,
		});
		res.cookie(COOKIE_JWT_SIGNATURE, signature, {
			httpOnly: true,
			secure: isProduction,
		});
		res.cookie(COOKIE_REFRESH_TOKEN, refreshToken);
		res.cookie(COOKIE_CSRF, req.csrfToken(), {
			secure: isProduction,
		});
	}

	private clearCookie(req, res) {
		for (const cookieName of Object.keys(req.cookies)) {
			res.clearCookie(cookieName);
		}
	}
}
