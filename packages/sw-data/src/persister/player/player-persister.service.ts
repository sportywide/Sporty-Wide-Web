import path from 'path';
import util from 'util';
import { FifaPlayer } from '@data/crawler/fifa-crawler.service';
import { defaultFuzzyOptions } from '@data/data.constants';
import { Team } from '@schema/team/models/team.entity';
import { Injectable, Inject } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { fsPromise } from '@shared/lib/utils/promisify/fs';
import { Player } from '@schema/player/models/player.entity';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import Fuse from 'fuse.js';
import { ScoreboardPlayer } from '@shared/lib/dtos/player/player.dto';
import { chunk, keyBy } from 'lodash';
import { PlayerMatcherService } from '@data/core/match/player-matcher.service';
import { PlayerService } from '@schema/player/services/player.service';
const glob = util.promisify(require('glob'));

@Injectable()
export class PlayerPersisterService {
	constructor(
		@Inject(DATA_LOGGER) private readonly logger: Logger,
		@InjectSwRepository(Player) private readonly playerRepository: SwRepository<Player>,
		private readonly playerService: PlayerService,
		@InjectSwRepository(Team) private readonly teamRepository: SwRepository<Team>
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
		const dbTeams = await this.teamRepository.find({
			leagueId: leagueId,
		});
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
			const dbPlayers = await this.playerRepository.find({
				teamId: foundTeams[0].id,
			});
			const playerMatcherService = new PlayerMatcherService(dbPlayers, this.logger);
			const result = playerMatcherService.matchPlayers(
				transformedPlayers.map(player => ({
					id: player.url,
					shirt: player.jersey,
					name: player.name,
					team: teamName,
				}))
			);
			await Promise.all(
				players.map(async player => {
					if (!result[player.url]) {
						return;
					}
					const dbPlayer = result[player.url];
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
			const dbPlayers = await this.playerRepository.findByIds(playerIds);
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
						await this.playerRepository.save(updated);
						this.logger.trace(`Persisted player ${updated.name} from ${updated.team}`);
					} catch (e) {
						this.logger.error(`Failed to save player ${updated.name}`, e);
					}
				})
			);
		}
	}
}
