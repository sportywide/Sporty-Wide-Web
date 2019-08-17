import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '@api/auth/services/auth.service';
import { Provider } from 'nconf';
import { API_CONFIG } from '@core/config/config.constants';
import { Request } from '@root/node_modules/@types/express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService, @Inject(API_CONFIG) private readonly config: Provider) {
		super({
			jwtFromRequest: req => this.getToken(req),
			passReqToCallback: false,
			secretOrKey: config.get('jwt:secret_key'),
		});
	}

	getToken(req: Request) {
		return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
	}

	getRefreshToken(req: Request) {
		return req.get('Refresh-Token');
	}

	async validate(payload, done: Function) {
		try {
			const user = await this.authService.verify(payload);
			done(null, user);
		} catch (err) {
			done(err, null);
		}
	}
}
