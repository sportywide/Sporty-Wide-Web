import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '@api/auth/services/auth.service';
import { Provider } from 'nconf';
import { API_CONFIG } from '@core/config/config.constants';
import { Request } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService, @Inject(API_CONFIG) private readonly config: Provider) {
		super({
			jwtFromRequest: req => this.getToken(req),
			passReqToCallback: false,
			secretOrKey: config.get('auth:jwt:secret_key'),
		});
	}

	getToken(req: Request) {
		return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
	}

	getRefreshToken(req: Request) {
		return req.get('Refresh-Token');
	}

	async validate(payload, verified) {
		try {
			return await this.authService.verify(payload);
		} catch (e) {
			if (e.constructor === TokenExpiredError) {
				verified(null, null, e);
				return;
			}
			verified(e);
		}
	}
}
