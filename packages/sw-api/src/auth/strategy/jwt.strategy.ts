import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '@api/auth/services/auth.service';
import { Request } from 'express';
import { Provider } from 'nconf';
import { COOKIE_JWT_PAYLOAD, COOKIE_JWT_SIGNATURE } from '@api/auth/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService, @Inject('API_CONFIG') private readonly config: Provider) {
		super({
			jwtFromRequest: req => this.getToken(req),
			passReqToCallback: false,
			secretOrKey: config.get('jwt:secret_key'),
		});
	}

	getToken(req: Request) {
		return `${req.cookies[COOKIE_JWT_PAYLOAD]}.${req.cookies[COOKIE_JWT_SIGNATURE]}`;
	}

	async validate(payload, done: Function) {
		try {
			const user = this.authService.verify(payload);
			done(null, user);
		} catch (err) {
			done(err, null);
		}
	}
}
