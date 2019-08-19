import { Strategy } from 'passport-facebook';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Provider } from 'nconf';
import { API_CONFIG } from '@core/config/config.constants';
import { AuthService } from '@api/auth/services/auth.service';
import { SocialProfileDto } from '@shared/lib/dtos/user/social-profile.dto';
import { UserGender } from '@shared/lib/dtos/user/enum/user-gender.enum';
import { SocialProvider } from '@shared/lib/dtos/user/enum/social-provider.enum';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService, @Inject(API_CONFIG) private readonly config: Provider) {
		super({
			clientID: config.get('auth:facebook:client_id'),
			clientSecret: config.get('auth:facebook:client_secret'),
			passReqToCallback: true,
			profileFields: ['name', 'gender', 'emails', 'displayName', 'profileUrl'],
		});
	}

	validate(request, accessToken, refreshToken, payload) {
		const [email = {}] = payload.emails || [];
		const profile: SocialProfileDto = {
			displayName: payload.displayName,
			email: email.value,
			id: payload.id,
			username: payload.username || payload.id,
			firstName: payload.name.givenName,
			lastName: payload.name.familyName,
			gender: payload.gender === 'male' ? UserGender.MALE : UserGender.FEMALE,
		};
		return this.authService.socialSignin(SocialProvider.FACEBOOK, profile);
	}
}
