import { Inject, Service } from 'typedi';
import { ApiService } from '@web/shared/lib/http/api.service';
import { map } from 'rxjs/operators';
import { format } from 'date-fns';
import { PlayerBettingInputDto } from '@shared/lib/dtos/player/player-betting.dto';

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

	saveBetting({
		leagueId,
		week = new Date(),
		betting,
	}: {
		leagueId: number;
		week?: Date;
		betting: PlayerBettingInputDto[];
	}) {
		return this.apiService
			.api()
			.post(
				`/player/me/betting/${leagueId}`,
				{ betting },
				{
					params: {
						date: format(week, 'yyyy-MM-dd'),
					},
				}
			)
			.pipe(map(response => response.data));
	}

	hasBetting({ leagueId, week = new Date() }) {
		return this.apiService
			.api()
			.get(`/player/me/check/betting/${leagueId}`, {
				params: {
					date: format(week, 'yyyy-MM-dd'),
				},
			})
			.pipe(map(response => response.data));
	}
}
