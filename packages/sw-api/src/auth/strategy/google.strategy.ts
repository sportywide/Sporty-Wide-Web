import { Strategy } from 'passport-google-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Provider } from 'nconf';
import { API_CONFIG } from '@core/config/config.constants';
import { AuthService } from '@api/auth/services/auth.service';
import { SocialProvider } from '@shared/lib/dtos/user/enum/social-provider.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService, @Inject(API_CONFIG) private readonly config: Provider) {
		super({
			clientID: config.get('auth:google:client_id'),
			clientSecret: config.get('auth:google:client_secret'),
			passReqToCallback: true,
		});
	}

	async validate(request, profile, done: Function) {
		try {
			const user = await this.authService.socialSignin(SocialProvider.GOOGLE, profile);
			done(null, user);
		} catch (err) {
			done(err, null);
		}
	}
}
