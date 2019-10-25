import path from 'path';
import util from 'util';
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
		await Promise.all(
			files.map(async file => {
				try {
					this.logger.info(`Reading from resource ${file}`);
					const content = await fsPromise.readFile(file, 'utf8');

					const playerTeamMap = JSON.parse(content);
					return this.saveScoreBoardPlayers(playerTeamMap);
				} catch (e) {
					this.logger.error(`Failed to read file ${file}`, e);
				}
			})
		);
	}

	private async saveScoreBoardPlayers(playerTeamMap) {
		const playerMap: { [key: string]: any[] } = playerTeamMap.players;
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
			this.logger.debug(`Match ${foundTeams[0].title} with ${teamName}`);
			const dbPlayers = await this.playerRepository.find({
				teamId: foundTeams[0].id,
			});
			const playerFuse = new Fuse(dbPlayers, {
				...defaultFuzzyOptions,
				keys: ['name'],
			});
			for (const player of players) {
				const foundPlayers = playerFuse.search(player.playerName);
				if (!foundPlayers.length) {
					this.logger.error('Cannot find the player', player.playerName);
					continue;
				}
				this.logger.debug(`Match ${foundPlayers[0].name} with ${player.playerName}`);
			}
		}
	}

	private saveFifaPlayers(players) {
		return Promise.all(
			players.map(async player => {
				const dbObj = {
					...player,
					id: player.fifaId,
					nationality: player.nationality.title,
					nationalityId: player.nationality.fifaId,
					positions: player.positions,
					teamName: player.team.title,
					teamId: player.team.fifaId,
				};
				delete dbObj['fifaId'];
				delete dbObj['team'];
				try {
					await this.playerRepository.save(dbObj);
					this.logger.trace(`Persisted player ${dbObj.name} from ${dbObj.team}`);
				} catch (e) {
					this.logger.error(`Failed to save player ${dbObj.name}`);
				}
			})
		);
	}
}
