import { Inject, Service } from 'typedi';
import { ApiService } from '@web/shared/lib/http/api.service';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer-imp';
import { UserDto } from '@shared/lib/dtos/user/user.dto';

@Service({ global: true })
export class UserService {
	constructor(
		@Inject(type => ApiService)
		private readonly apiService: ApiService
	) {}

	getUserFromToken(token: string) {
		return this.apiService
			.api()
			.get('/user/token', {
				params: {
					token,
				},
			})
			.pipe(map(({ data }) => data));
	}

	getBasicProfile(userId) {
		return this.apiService
			.api()
			.get(`/user/${userId}`)
			.pipe(map(({ data }) => plainToClass(UserDto, data)));
	}

	saveBasicProfile(userId, data) {
		return this.apiService.api().put(`/user/${userId}`, data);
	}
}
