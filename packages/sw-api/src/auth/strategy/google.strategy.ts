import { Strategy } from 'passport-google-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Provider } from 'nconf';
import { API_CONFIG } from '@core/config/config.constants';
import { AuthService } from '@api/auth/services/auth.service';
import { SocialProvider } from '@shared/lib/dtos/user/enum/social-provider.enum';
import { SocialProfileDto } from '@shared/lib/dtos/user/social-profile.dto';
import { UserGender } from '@shared/lib/dtos/user/enum/user-gender.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService, @Inject(API_CONFIG) private readonly config: Provider) {
		super({
			clientID: config.get('auth:google:client_id'),
			clientSecret: config.get('auth:google:client_secret'),
			passReqToCallback: true,
		});
	}

	async validate(request, accessToken, refreshToken, payload) {
		const profile: SocialProfileDto = {
			displayName: payload.displayName,
			email: payload.email,
			id: payload.id,
			username: payload.id,
			firstName: payload.name.givenName,
			lastName: payload.name.familyName,
			gender: payload.gender === 'male' ? UserGender.MALE : UserGender.FEMALE,
			imageUrl: payload.picture,
		};
		return await this.authService.socialSignin(SocialProvider.GOOGLE, profile);
	}
}
