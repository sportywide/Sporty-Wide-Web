import { Inject, Service } from 'typedi';
import { Observable } from 'rxjs';
import { ApiService } from '@web/shared/lib/http/api.service';
import { map } from 'rxjs/operators';
import { UserLeagueDto } from '@shared/lib/dtos/leagues/user-league.dto';
import { plainToClass } from 'class-transformer-imp';
import { FormationName } from '@shared/lib/dtos/formation/formation.dto';

@Service()
export class UserLeagueService {
	constructor(@Inject(type => ApiService) private readonly apiService: ApiService) {}

	fetchUserLeagues(userId: number): Observable<UserLeagueDto[]> {
		return this.apiService
			.api()
			.get(`/leagues/user/${userId}`)
			.pipe(map(({ data: payload }) => payload.map(league => plainToClass(UserLeagueDto, league))));
	}

	joinLeague({
		userId,
		leagueId,
		formation = '4-4-2',
	}: {
		userId: number;
		leagueId: number;
		formation: FormationName;
	}) {
		return this.apiService.api().put(`/leagues/${leagueId}/user/${userId}/join?formation=${formation}`);
	}

	leaveLeague({ userId, leagueId }: { userId: number; leagueId: number }) {
		return this.apiService.api().put(`/leagues/${leagueId}/user/${userId}/leave`);
	}
}
