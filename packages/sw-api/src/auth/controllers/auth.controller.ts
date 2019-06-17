import { Body, Controller, Post, Req, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '@api/auth/services/auth.service';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthGuard } from '@api/auth/guards/local.guard';
import { Response } from 'express';
import { COOKIE_CSRF, COOKIE_JWT_PAYLOAD, COOKIE_JWT_SIGNATURE } from '@api/auth/constants';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { AuthenticatedGuard } from '@api/auth/guards/authenticated.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

	@Post('signup')
	@UseGuards(AuthenticatedGuard)
	public async signUp(@Body() user: CreateUserDto, @Req() req, @Res() res) {
		const jwt = await this.authService.signUp(user);
		AuthController.setCookies({ jwt, res, req });
		res.send(jwt);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthenticatedGuard, LocalAuthGuard)
	public async login(@Req() req, @Res() res) {
		const jwt = await this.authService.jwtSign(req.user);
		AuthController.setCookies({ jwt, res, req });
		res.send(jwt);
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	public async logout(@Req() req, @Res() res) {
		AuthController.clearCookie(req, res);
		res.send();
	}

	private static setCookies({ jwt, req, res }: { jwt: string; req; res: Response }) {
		const isProduction = process.env.NODE_ENV === 'production';
		const [header, payload, signature] = jwt.split('.');

		res.cookie(COOKIE_JWT_PAYLOAD, [header, payload].join('.'), {
			secure: isProduction,
		});
		res.cookie(COOKIE_JWT_SIGNATURE, signature, {
			httpOnly: true,
			secure: isProduction,
		});
		res.cookie(COOKIE_CSRF, req.csrfToken(), {
			secure: isProduction,
		});
	}

	private static clearCookie(req, res) {
		for (const cookieName of Object.keys(req.cookies)) {
			res.clearCookie(cookieName);
		}
	}
}
