import { Inject, Service } from 'typedi';
import { Observable } from 'rxjs';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { ApiService } from '@web/shared/lib/http/api.service';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer-imp';
import { LeagueStandingsDto } from '@shared/lib/dtos/leagues/league-standings.dto';

@Service()
export class LeagueService {
	constructor(@Inject(type => ApiService) private readonly apiService: ApiService) {}

	fetchLeagues(): Observable<LeagueDto[]> {
		return this.apiService
			.api()
			.get('/leagues')
			.pipe(map(({ data: payload }) => payload.map(league => plainToClass(LeagueDto, league))));
	}

	fetchLeague(id: number): Observable<LeagueDto> {
		return this.apiService
			.api()
			.get(`/leagues/${id}`)
			.pipe(map(({ data: payload }) => plainToClass(LeagueDto, payload)));
	}

	fetchLeagueStandings(id: number): Observable<LeagueStandingsDto> {
		return this.apiService
			.api()
			.get(`/leagues/standings/${id}`)
			.pipe(map(({ data: payload }) => payload));
	}
}
