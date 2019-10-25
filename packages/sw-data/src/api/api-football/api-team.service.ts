import { Inject, Injectable } from '@nestjs/common';
import { ResultsService } from './../../crawler/results.service';
import { ApiFootballService } from './api-football.service';

@Injectable()
export class TeamApiService extends ResultsService {
	constructor(private readonly apiService: ApiFootballService) {
		super();
	}

	getTeams(leagueId) {
		return this.apiService
			.v2()
			.get(`/teams/league/${leagueId}`)
			.then(({ data }) => data);
	}
}
