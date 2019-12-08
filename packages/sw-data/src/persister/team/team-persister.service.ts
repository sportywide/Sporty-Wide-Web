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
import { LeagueResultService } from '@schema/league/services/league-result.service';
import { ScoreboardTeam } from '@shared/lib/dtos/leagues/league-standings.dto';
const glob = util.promisify(require('glob'));

@Injectable()
export class TeamPersisterService {
	constructor(
		@Inject(DATA_LOGGER) private readonly logger: Logger,
		@InjectSwRepository(Team) private readonly teamRepository: SwRepository<Team>,
		private readonly leagueResultService: LeagueResultService
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
		await Promise.all(
			files.map(async file => {
				try {
					this.logger.info(`Reading from resource ${file}`);
					const content = await fsPromise.readFile(file, 'utf8');

					const leagueTeams = JSON.parse(content);
					await this.saveScoreboardTeamResult(leagueTeams);
				} catch (e) {
					this.logger.error(`Failed to read file ${file}`, e);
				}
			})
		);
	}

	async saveScoreboardTeamResult(leagueTeams: { league: League; teams: ScoreboardTeam[]; season: string }) {
		const league = leagueTeams.league;
		const teamsInfo = leagueTeams.teams;
		const { matchedTeams } = await this.matchScoreboardTeams(leagueTeams);
		const teamUrlMap = Array.from(matchedTeams.entries()).reduce((currentObject, [teamInfo, team]) => {
			return {
				...currentObject,
				[teamInfo.url]: team,
			};
		}, {});

		return this.leagueResultService.save({
			leagueId: league.id,
			table: teamsInfo.map(team => {
				const dbTeam = teamUrlMap[team.url];
				if (!dbTeam) {
					return team;
				}
				return {
					...team,
					teamId: dbTeam.id,
					name: dbTeam.title,
				};
			}),
			season: leagueTeams.season,
		});
	}

	private async matchScoreboardTeams(leagueTeams: {
		league: League;
		teams: ScoreboardTeam[];
	}): Promise<{ matchedTeams: Map<ScoreboardTeam, Team>; unresolvedTeams: ScoreboardTeam[] }> {
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
		const matchedTeams = new Map<ScoreboardTeam, Team>();
		const fuse = new Fuse(dbTeams, fuzzyOptions);
		for (const teamInfo of teamsInfo) {
			const foundTeam = fuse.search(teamInfo.name);
			if (!foundTeam.length) {
				unresolvedTeams.push(teamInfo);
				this.logger.error('Cannot find the team', teamInfo.name);
				continue;
			}
			this.logger.debug(`Match ${foundTeam[0].title} with ${teamInfo.name}`);
			matchedTeams.set(teamInfo, foundTeam[0]);
		}

		return {
			matchedTeams,
			unresolvedTeams,
		};
	}

	async saveFifaTeams(teams: FifaTeam[]) {
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
					await this.teamRepository.save(dbObj);
					this.logger.trace(`Persisted team ${dbObj.name}`);
				} catch (e) {
					this.logger.error(`Failed to save team ${dbObj.name}`, e);
				}
			})
		);
	}
}
