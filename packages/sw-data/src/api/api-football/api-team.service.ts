import { Logger } from 'log4js';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { Inject, Injectable } from '@nestjs/common';
import { ResultsService } from '@data/crawler/results.service';
import { ApiFootballService } from './api-football.service';

@Injectable()
export class TeamApiService extends ResultsService {
	constructor(
		private readonly apiService: ApiFootballService,
		@Inject(DATA_LOGGER) private readonly dataLogger: Logger
	) {
		super();
	}

	getTeams(leagueId) {
		this.dataLogger.info('Fetching teams for league', leagueId);
		return this.apiService
			.v2()
			.get(`/teams/league/${leagueId}`)
			.then(({ data }) => data);
	}
}
