import { Inject, Service } from 'typedi';
import { Observable } from 'rxjs';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { ApiService } from '@web/shared/lib/http/api.service';
import { map } from 'rxjs/operators';

@Service({
	global: true,
})
export class LeagueService {
	constructor(@Inject(type => ApiService) private readonly apiService: ApiService) {}

	loadLeagues(): Observable<LeagueDto[]> {
		return this.apiService
			.api()
			.get('/leagues')
			.pipe(map(({ data }) => data));
	}
}
