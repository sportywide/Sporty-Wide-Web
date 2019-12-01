import { Inject, Service } from 'typedi';
import { Observable } from 'rxjs';
import { ApiService } from '@web/shared/lib/http/api.service';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer-imp';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';

@Service()
export class FixtureService {
	constructor(@Inject(type => ApiService) private readonly apiService: ApiService) {}

	fetchThisWeekFixtures(leagueId: number): Observable<FixtureDto[]> {
		return this.apiService
			.api()
			.get(`/fixtures/week/${leagueId}`)
			.pipe(
				map(({ data: payload }) =>
					payload.map(league =>
						plainToClass(FixtureDto, league, {
							excludeExtraneousValues: false,
						})
					)
				)
			);
	}
}
