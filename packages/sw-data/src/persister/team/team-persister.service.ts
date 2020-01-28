import util from 'util';
import path from 'path';
import { FifaTeam } from '@data/crawler/fifa-crawler.service';
import { League } from '@schema/league/models/league.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Team } from '@schema/team/models/team.entity';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { fsPromise } from '@shared/lib/utils/promisify/fs';
import { LeagueResultService } from '@schema/league/services/league-result.service';
import { EspnTeam, ScoreboardTeam } from '@shared/lib/dtos/leagues/league-standings.dto';
import { TeamService } from '@schema/team/services/team.service';
import { FifaImageService } from '@data/persister/fifa/fifa-image.service';

const glob = util.promisify(require('glob'));

@Injectable()
export class TeamPersisterService {
	constructor(
		@Inject(DATA_LOGGER) private readonly logger: Logger,
		private readonly leagueResultService: LeagueResultService,
		private readonly fifaImageService: FifaImageService,
		private readonly teamService: TeamService
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
					await this.saveTeamsResult(leagueTeams);
				} catch (e) {
					this.logger.error(`Failed to read file ${file}`, e);
				}
			})
		);
	}

	async saveTeamsFromEspnInfoFiles() {
		const files = await glob('espn*.json', {
			cwd: path.resolve(process.cwd(), 'resources', 'teams'),
			absolute: true,
		});
		await Promise.all(
			files.map(async file => {
				try {
					this.logger.info(`Reading from resource ${file}`);
					const content = await fsPromise.readFile(file, 'utf8');

					const leagueTeams = JSON.parse(content);
					await this.saveTeamsResult(leagueTeams);
				} catch (e) {
					this.logger.error(`Failed to read file ${file}`, e);
				}
			})
		);
	}

	async saveTeamsResult(leagueTeams: { league: League; teams: EspnTeam[]; season: string }) {
		const league = leagueTeams.league;
		const teamsInfo = leagueTeams.teams;
		const { matchedTeams } = await this.matchExternalTeamResult(leagueTeams);
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

	private async matchExternalTeamResult(leagueTeams: {
		league: League;
		teams: EspnTeam[];
	}): Promise<{ matchedTeams: Map<EspnTeam, Team>; unresolvedTeams: EspnTeam[] }> {
		const league = leagueTeams.league;
		const teamsInfo = leagueTeams.teams;
		const dbTeams = await this.teamService.find({
			where: {
				leagueId: league.id,
			},
		});
		const unresolvedTeams: any[] = [];
		const matchedTeams = new Map<EspnTeam, Team>();
		for (const teamInfo of teamsInfo) {
			const foundTeam = this.teamService.fuzzySearch(dbTeams, teamInfo.name);
			if (!foundTeam) {
				unresolvedTeams.push(teamInfo);
				this.logger.error('Cannot find the team', teamInfo.name);
				continue;
			}
			this.logger.debug(`Match ${foundTeam.title} with ${teamInfo.name}`);
			matchedTeams.set(teamInfo, foundTeam);
		}

		return {
			matchedTeams,
			unresolvedTeams,
		};
	}

	async saveFifaTeams(teams: FifaTeam[]) {
		await Promise.all(
			teams.map(async team => {
				const dbObj = {
					...team,
					id: team.fifaId,
					league: team.league.title,
					leagueId: team.league.fifaId,
				};

				delete dbObj['fifaId'];

				try {
					await this.teamService.saveOne(dbObj);
					this.logger.trace(`Persisted team ${dbObj.name}`);
				} catch (e) {
					this.logger.error(`Failed to save team ${dbObj.name}`, e);
				}
			})
		);
		await this.fifaImageService.saveFifaImages(
			'teams',
			teams.map(team => team.image)
		);
	}
}
