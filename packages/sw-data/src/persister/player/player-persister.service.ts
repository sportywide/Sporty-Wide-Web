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
import { ScoreboardPlayer } from '@shared/lib/dtos/leagues/league-standings.dto';
import { chunk, keyBy } from 'lodash';
const glob = util.promisify(require('glob'));

@Injectable()
export class PlayerPersisterService {
	constructor(
		@Inject(DATA_LOGGER) private readonly logger: Logger,
		@InjectSwRepository(Player) private readonly playerRepository: SwRepository<Player>,
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
		const allUnresolvedPlayers: { fifa: Player[]; scoreboard: ScoreboardPlayer[] } = {
			fifa: [],
			scoreboard: [],
		};
		let allMatchedPlayers = {};
		await Promise.all(
			files.map(async file => {
				try {
					this.logger.info(`Reading from resource ${file}`);
					const content = await fsPromise.readFile(file, 'utf8');

					const playerTeamMap = JSON.parse(content);
					const { unresolvedPlayers, matchedPlayers } = await this.matchScoreBoardPlayers(playerTeamMap);
					allMatchedPlayers = { ...allMatchedPlayers, ...matchedPlayers };
					allUnresolvedPlayers.fifa.push(...unresolvedPlayers.fifa);
					allUnresolvedPlayers.scoreboard.push(...unresolvedPlayers.scoreboard);
				} catch (e) {
					this.logger.error(`Failed to read file ${file}`, e);
				}
			})
		);
	}

	private async matchScoreBoardPlayers(playerTeamMap) {
		const playerMap: { [key: string]: ScoreboardPlayer[] } = playerTeamMap.players;
		const leagueId = playerTeamMap.leagueId;
		const dbTeams = await this.teamRepository.find({
			leagueId: leagueId,
		});
		const teamFuse = new Fuse(dbTeams, {
			...defaultFuzzyOptions,
			keys: ['title', 'alias'],
		});

		const matchedPlayers = {};
		const unresolvedPlayers: { scoreboard: ScoreboardPlayer[]; fifa: Player[] } = {
			scoreboard: [],
			fifa: [],
		};
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
			const playerFuse = new Fuse(dbPlayers, {
				...defaultFuzzyOptions,
				threshold: 0.5,
				tokenize: true,
				keys: ['name'],
			});
			for (const player of transformedPlayers) {
				const foundPlayers = playerFuse.search(player.name);
				if (!foundPlayers.length) {
					this.logger.error('Cannot find scoreboard player', player.name);
					unresolvedPlayers.scoreboard.push(player);
					continue;
				}
				this.logger.trace(`Match ${foundPlayers[0].name} with ${player.name}`);
				matchedPlayers[foundPlayers[0].id] = player;
			}

			for (const dbPlayer of dbPlayers) {
				if (!matchedPlayers[dbPlayer.id]) {
					unresolvedPlayers.fifa.push(dbPlayer);
				}
			}
		}

		return {
			matchedPlayers,
			unresolvedPlayers,
		};
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
