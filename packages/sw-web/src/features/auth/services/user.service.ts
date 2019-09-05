import { Inject, Service } from 'typedi';
import { ApiService } from '@web/shared/lib/http/api.service';
import { map } from 'rxjs/operators';

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
}
