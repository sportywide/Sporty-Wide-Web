import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: 'username',
			passReqToCallback: false,
		});
	}

	async validate(username, password, done: Function) {
		try {
			const user = this.authService.logIn(username, password);
			done(null, user);
		} catch (err) {
			done(err, null);
		}
	}
}
