import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { AuthService } from '@api/auth/services/auth.service';
import { Provider } from 'nconf';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService, @Inject('API_CONFIG') private readonly config: Provider) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			passReqToCallback: false,
			secret: config.get('jwt:secret_key'),
		});
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
