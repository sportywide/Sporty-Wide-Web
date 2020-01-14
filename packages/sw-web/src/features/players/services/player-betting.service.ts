import { Inject, Service } from 'typedi';
import { ApiService } from '@web/shared/lib/http/api.service';
import { map } from 'rxjs/operators';

@Service()
export class PlayerBettingService {
	constructor(
		@Inject(type => ApiService)
		private readonly apiService: ApiService
	) {}

	getMyBetting({ leagueId, week }) {
		return this.apiService
			.api()
			.get(`/player/me/betting/${leagueId}`, {
				params: {
					date: week,
				},
			})
			.pipe(map(response => response.data));
	}
}
