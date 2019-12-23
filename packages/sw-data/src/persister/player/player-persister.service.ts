import path from 'path';
import util from 'util';
import { FifaPlayer } from '@data/crawler/fifa-crawler.service';
import { defaultFuzzyOptions } from '@shared/lib/data/data.constants';
import { Inject, Injectable } from '@nestjs/common';
import { fsPromise } from '@shared/lib/utils/promisify/fs';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import Fuse from 'fuse.js';
import { ScoreboardPlayer } from '@shared/lib/dtos/player/player.dto';
import { chunk, keyBy, omit } from 'lodash';
import { PlayerService } from '@schema/player/services/player.service';
import { WhoscorePlayerRating } from '@shared/lib/dtos/player/player-rating.dto';
import { TeamService } from '@schema/team/services/team.service';

const glob = util.promisify(require('glob'));

@Injectable()
export class PlayerPersisterService {
	constructor(
		@Inject(DATA_LOGGER) private readonly logger: Logger,
		private readonly playerService: PlayerService,
		private readonly teamService: TeamService
	) {}

	async saveFifaPlayersFromPlayerInfoFiles() {
		try {
			const files = await glob('fifa*.json', {
				cwd: path.resolve(process.cwd(), 'resources', 'players'),
				absolute: true,
			});
			await Promise.all(
				files.map(async file => {
					try {
						this.logger.info(`Reading from resource ${file}`);
						const content = await fsPromise.readFile(file, 'utf8');

						const players = JSON.parse(content);
						return this.saveFifaPlayers(players);
					} catch (e) {
						this.logger.error(`Failed to read file ${file}`, e);
					}
				})
			);
		} catch (e) {
			this.logger.error(`Failed to read player files`, e);
		}
	}

	async savePlayersFromScoreBoardInfoFiles() {
		const files = await glob('scoreboard*.json', {
			cwd: path.resolve(process.cwd(), 'resources', 'players'),
			absolute: true,
		});
		await Promise.all(
			files.map(async file => {
				try {
					this.logger.info(`Reading from resource ${file}`);
					const content = await fsPromise.readFile(file, 'utf8');

					const playerTeamMap = JSON.parse(content);
					await this.saveScoreboardPlayer(playerTeamMap);
				} catch (e) {
					this.logger.error(`Failed to read file ${file}`, e);
				}
			})
		);
	}

	async saveScoreboardPlayer(playerTeamMap: {
		players: { [key: string]: ScoreboardPlayer[] };
		leagueId: number;
		season: string;
	}) {
		const playerMap: { [key: string]: ScoreboardPlayer[] } = playerTeamMap.players;
		const leagueId = playerTeamMap.leagueId;
		const dbTeams = await this.teamService.findByLeague(leagueId);
		const teamFuse = new Fuse(dbTeams, {
			...defaultFuzzyOptions,
			keys: ['title', 'alias'],
		});

		for (const [teamName, players] of Object.entries(playerMap)) {
			const foundTeams = teamFuse.search(teamName);
			if (!foundTeams.length) {
				this.logger.error('Cannot find the team', teamName);
				continue;
			}
			this.logger.info(`Match ${foundTeams[0].title} with ${teamName}`);

			const transformedPlayers = players.map(player => ({
				...player,
				name: player.name
					.split(/\s+/)
					.reverse()
					.join(' '),
			}));
			const dbPlayers = await this.playerService.getPlayersByTeam(foundTeams[0].id);
			const result = this.playerService.fuzzySearch(
				dbPlayers,
				transformedPlayers.map(player => ({
					shirt: player.jersey,
					name: player.name,
					team: teamName,
				}))
			);
			await Promise.all(
				transformedPlayers.map(async (player, index) => {
					if (!result[index]) {
						return;
					}
					const dbPlayer = result[index];
					await this.playerService.savePlayerStat({
						...player,
						playerId: dbPlayer.id,
						season: player.season,
					});
				})
			);
		}
	}

	async saveFifaPlayers(players: FifaPlayer[]) {
		const playerGroups = chunk(players, 50);
		const updatedFields = ['id', 'name', 'rating', 'url', 'image'];
		for (const playerGroup of playerGroups) {
			const playerIds = playerGroup.map(player => player.fifaId);
			const dbPlayers = await this.playerService.findByIds(playerIds);
			const playerMap = keyBy(dbPlayers, 'id');
			await Promise.all(
				playerGroup.map(async player => {
					const updated = {
						...player,
						id: player.fifaId,
						nationality: player.nationality.title,
						nationalityId: player.nationality.fifaId,
						positions: player.positions,
						teamName: player.team.title,
						teamId: player.team.fifaId,
					};
					delete updated['fifaId'];
					delete updated['team'];
					const existingDbPlayer = playerMap[updated.id];

					if (existingDbPlayer) {
						for (const key of Object.keys(existingDbPlayer.toPlain())) {
							if (!updatedFields.includes(key) && existingDbPlayer[key]) {
								delete updated[key];
							}
						}
					}
					try {
						await this.playerService.saveOne(updated);
						this.logger.trace(`Persisted player ${updated.name} from ${updated.team}`);
					} catch (e) {
						this.logger.error(`Failed to save player ${updated.name}`, e);
					}
				})
			);
		}
	}

	async savePlayerRatings(fixtureId, team: { id: number; name: string }, playerRatings: WhoscorePlayerRating[]) {
		const dbPlayers = await this.playerService.getPlayersByTeam(team.id);
		const matchedPlayers = this.playerService.fuzzySearch(
			dbPlayers,
			playerRatings.map(playerRating => ({
				name: playerRating.name,
				shirt: playerRating.shirt,
				team: team.name,
			}))
		);

		await Promise.all(
			playerRatings.map(async (playerRating, index) => {
				const matchedPlayer = matchedPlayers[index];
				if (!matchedPlayer) {
					return;
				}
				await this.playerService.savePlayerRating({
					...omit(playerRating, 'name', 'shirt'),
					teamId: matchedPlayer.teamId,
					playerId: matchedPlayer.id,
					fixtureId,
				});
			})
		);
	}
}
