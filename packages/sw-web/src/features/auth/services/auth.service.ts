import { Inject, Service } from 'typedi';
import { of } from 'rxjs';
import { ApiService } from '@web/shared/lib/http/api.service';
import { CompleteSocialProfileDto } from '@shared/lib/dtos/user/complete-social-profile.dto';
import { ResetPasswordDto } from '@shared/lib/dtos/user/reset-password-dto';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { LoginDto } from '@shared/lib/dtos/user/login.dto';
import { isBrowser } from '@web/shared/lib/environment';

@Service()
export class AuthService {
	constructor(
		@Inject(type => ApiService)
		private readonly apiService: ApiService,
		@Inject('context') private readonly context
	) {}

	signup(userDto: CreateUserDto) {
		return this.apiService.auth().post('/signup', userDto);
	}

	login(loginDto: LoginDto) {
		return this.apiService.auth().post('/login', loginDto);
	}

	logout() {
		if (this.context.req && this.context.res) {
			for (const cookieName of Object.keys(this.context.req.cookies || {})) {
				this.context.res.clearCookie(cookieName);
			}
			return of(null);
		} else {
			return this.apiService.auth().post('/logout');
		}
	}

	confirmSocial(completeSocialProfileDto: CompleteSocialProfileDto) {
		return this.apiService.auth().post('/complete-social-profile', completeSocialProfileDto);
	}

	resendVerficationEmail(email: string) {
		return this.apiService.auth().post('/resend-verification', { email });
	}

	sendForgotPasswordEmail(body) {
		return this.apiService.auth().post('/forgot-password', body);
	}

	resetPassword({
		userId,
		token,
		resetPasswordDto,
	}: {
		userId: number;
		token: string;
		resetPasswordDto: ResetPasswordDto;
	}) {
		return this.apiService
			.auth()
			.post(`/reset-password/${userId}?token=${encodeURIComponent(token)}`, resetPasswordDto);
	}
}
