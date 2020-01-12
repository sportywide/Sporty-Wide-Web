import { Inject, Service } from 'typedi';
import { ApiService } from '@web/shared/lib/http/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Service()
export class ProfilePlayersService {
	constructor(
		@Inject(type => ApiService)
		private readonly apiService: ApiService
	) {}

	getMyPlayers({ leagueId, includes = [] }: { leagueId: number; includes?: string[] }): Observable<any> {
		return this.apiService
			.api()
			.get(`/player/me/league/${leagueId}`, {
				params: {
					includes,
				},
			})
			.pipe(map(response => response.data));
	}

	getMyLineup(leagueId) {
		return this.apiService
			.api()
			.get(`/player/me/lineup/${leagueId}`)
			.pipe(map(response => response.data));
	}
}
