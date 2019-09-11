import { Inject, Service } from 'typedi';
import { ApiService } from '@web/shared/lib/http/api.service';
import { CompleteSocialProfileDto } from '@shared/lib/dtos/user/complete-social-profile.dto';
import { ResetPasswordDto } from '@shared/lib/dtos/user/reset-password-dto';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { LoginDto } from '@shared/lib/dtos/user/login.dto';

@Service({ global: true })
export class AuthService {
	constructor(
		@Inject(type => ApiService)
		private readonly apiService: ApiService
	) {}

	signup(userDto: CreateUserDto) {
		return this.apiService.auth().post('/signup', userDto);
	}

	login({ username, password }: LoginDto) {
		return this.apiService.auth().post(`/login?username=${username}&password=${password}`);
	}

	logout() {
		return this.apiService.auth().post('/logout');
	}

	confirmSocial(completeSocialProfileDto: CompleteSocialProfileDto) {
		return this.apiService.auth().post('/complete-social-profile', completeSocialProfileDto);
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
		return this.apiService.auth().post(`/reset-password/${userId}?token=${token}`, resetPasswordDto);
	}
}
