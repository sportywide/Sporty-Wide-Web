import { Inject, Service } from 'typedi';
import { ApiService } from '@web/shared/lib/http/api.service';
import { map } from 'rxjs/operators';

@Service()
export class UserScoreService {
	constructor(
		@Inject(type => ApiService)
		private readonly apiService: ApiService
	) {}

	fetchUserScore({ userId, leagueId }) {
		return this.apiService
			.api()
			.get(`/user/score/${userId}/league/${leagueId}`)
			.pipe(map(({ data }) => data));
	}
}
