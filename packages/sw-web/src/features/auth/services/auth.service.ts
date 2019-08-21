import { Service, Inject } from 'typedi';
import { ApiService } from '@web/shared/lib/http/api.service';

@Service({ global: true })
export class AuthService {
	constructor(@Inject(type => ApiService) private readonly apiService: ApiService) {}

	logout() {
		return this.apiService.auth().post('/logout');
	}
}
