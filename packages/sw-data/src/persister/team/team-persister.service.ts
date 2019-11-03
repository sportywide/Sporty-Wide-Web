import util from 'util';
import path from 'path';
import { FifaTeam } from '@data/crawler/fifa-crawler.service';
import { League } from '@schema/league/models/league.entity';
import { defaultFuzzyOptions } from '@data/data.constants';
import { Injectable, Inject } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { Team } from '@schema/team/models/team.entity';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { fsPromise } from '@shared/lib/utils/promisify/fs';
import Fuse from 'fuse.js';
import { ScoreboardTeam } from '@data/crawler/scoreboard-crawler.service';
const glob = util.promisify(require('glob'));

@Injectable()
export class TeamPersisterService {
	constructor(
		@Inject(DATA_LOGGER) private readonly logger: Logger,
		@InjectSwRepository(Team) private readonly teamRepository: SwRepository<Team>
	) {}

	async saveTeamsFromFifaInfoFiles() {
		const files = await glob('fifa*.json', {
			cwd: path.resolve(process.cwd(), 'resources', 'teams'),
			absolute: true,
		});
		await Promise.all(
			files.map(async file => {
				try {
					this.logger.info(`Reading from resource ${file}`);
					const content = await fsPromise.readFile(file, 'utf8');

					const teams = JSON.parse(content);
					return this.saveFifaTeams(teams);
				} catch (e) {
					this.logger.error(`Failed to read file ${file}`, e);
				}
			})
		);
	}

	async saveTeamsFromScoreBoardInfoFiles() {
		const files = await glob('scoreboard*.json', {
			cwd: path.resolve(process.cwd(), 'resources', 'teams'),
			absolute: true,
		});
		let allMatchedTeams = {};
		await Promise.all(
			files.map(async file => {
				try {
					this.logger.info(`Reading from resource ${file}`);
					const content = await fsPromise.readFile(file, 'utf8');

					const leagueTeams = JSON.parse(content);
					const { matchedTeams } = await this.matchScoreboardTeams(leagueTeams);
					allMatchedTeams = { ...allMatchedTeams, ...matchedTeams };
				} catch (e) {
					this.logger.error(`Failed to read file ${file}`, e);
				}
			})
		);

		return allMatchedTeams;
	}

	private async matchScoreboardTeams(leagueTeams: { league: League; teams: ScoreboardTeam[] }) {
		const league = leagueTeams.league;
		const teamsInfo = leagueTeams.teams;
		const dbTeams = await this.teamRepository.find({
			leagueId: league.id,
		});
		const fuzzyOptions = {
			...defaultFuzzyOptions,
			keys: ['title', 'alias'],
		};
		const unresolvedTeams: any[] = [];
		const matchedTeams = {};
		const fuse = new Fuse(dbTeams, fuzzyOptions);
		for (const teamInfo of teamsInfo) {
			const foundTeam = fuse.search(teamInfo.name);
			if (!foundTeam.length) {
				unresolvedTeams.push(teamInfo);
				this.logger.error('Cannot find the team', teamInfo.name);
				continue;
			}
			this.logger.debug(`Match ${foundTeam[0].title} with ${teamInfo.name}`);
			matchedTeams[foundTeam[0].id] = teamInfo;
		}

		return {
			matchedTeams,
			unresolvedTeams,
		};
	}

	private async saveFifaTeams(teams: FifaTeam[]) {
		return Promise.all(
			teams.map(async team => {
				const dbObj = {
					...team,
					id: team.fifaId,
					league: team.league.title,
					leagueId: team.league.fifaId,
				};

				delete dbObj['fifaId'];

				try {
					await this.teamRepository.upsert(dbObj, ['name', 'image', 'att', 'mid', 'def', 'ovr', 'rating']);
					this.logger.trace(`Persisted team ${dbObj.name}`);
				} catch (e) {
					this.logger.error(`Failed to save team ${dbObj.name}`);
				}
			})
		);
	}
}
