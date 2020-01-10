import { Inject, Service } from 'typedi';
import { Observable } from 'rxjs';
import { ApiService } from '@web/shared/lib/http/api.service';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer-imp';
import { FixtureDetailsDto, FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';
import { fromPairs, toPairs } from 'lodash';

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
							useProperties: true,
						})
					)
				)
			);
	}

	fetchWeeklyFixturesForTeams(teamIds): Observable<{ [key: number]: FixtureDto }> {
		return this.apiService
			.api()
			.get(`/fixtures/team/weekly`, {
				params: {
					// eslint-disable-next-line @typescript-eslint/camelcase
					team_id: teamIds,
				},
			})
			.pipe(
				map(({ data: fixtureMap }) =>
					fromPairs(
						toPairs(fixtureMap).map(([key, value]) => [
							key,
							plainToClass(FixtureDto, value, {
								useProperties: true,
							}),
						])
					)
				)
			);
	}

	fetchFixtureDetails(fixtureId: number): Observable<FixtureDetailsDto> {
		return this.apiService
			.api()
			.get(`/fixtures/${fixtureId}`)
			.pipe(
				map(({ data: fixture }) =>
					plainToClass(FixtureDetailsDto, fixture, {
						useProperties: true,
					})
				)
			);
	}

	fetchUpcomingFixturesForTeams(teamIds: number[]): Observable<{ [key: number]: FixtureDto }> {
		return this.apiService
			.api()
			.get(`/fixtures/team/upcoming`, {
				params: {
					// eslint-disable-next-line @typescript-eslint/camelcase
					team_id: teamIds,
				},
			})
			.pipe(
				map(({ data: fixtureMap }) =>
					fromPairs(
						toPairs(fixtureMap).map(([key, value]) => [
							key,
							plainToClass(FixtureDto, value, {
								useProperties: true,
							}),
						])
					)
				)
			);
	}
}
