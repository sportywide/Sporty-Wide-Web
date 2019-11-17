import { Inject, Service } from 'typedi';
import { ApiService } from '@web/shared/lib/http/api.service';
import { of, Observable } from 'rxjs';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { map } from 'rxjs/operators';

@Service()
export class ProfilePlayersService {
	constructor(
		@Inject(type => ApiService)
		private readonly apiService: ApiService
	) {}

	getProfilePlayers({ userId, leagueId }: { userId: number; leagueId: number }): Observable<any> {
		return this.apiService
			.api()
			.get(`/player/user/${userId}/league/${leagueId}`)
			.pipe(map(response => response.data));
	}
}
