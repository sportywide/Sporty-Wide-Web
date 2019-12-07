import { Player } from '@schema/player/models/player.entity';
import { Logger } from 'log4js';
import { defaultFuzzyOptions } from '@data/data.constants';
import Fuse from 'fuse.js';
import { similarity } from '@data/core/match/similarity';

export class PlayerMatcherService {
	private readonly playerFuse: Fuse<Player, any>;
	constructor(private readonly players: Player[], private readonly logger: Logger) {
		this.playerFuse = new Fuse(players, {
			...defaultFuzzyOptions,
			threshold: 0.5,
			keys: ['name'],
		});
	}

	matchPlayers(searchPlayers: { id: string; name: string; shirt: number; team: string }[]) {
		const result = {};
		for (const searchPlayer of searchPlayers) {
			const matchedPlayers = this.playerFuse.search(searchPlayer.name);
			let matchedPlayer = (matchedPlayers && matchedPlayers[0]) as Player;
			if (
				matchedPlayer &&
				(matchedPlayer.shirt === searchPlayer.shirt || similarity(matchedPlayer.name, searchPlayer.name) <= 0.3)
			) {
				this.logger.info(`Match ${matchedPlayer.name} with ${searchPlayer.name}`);
				result[searchPlayer.id] = matchedPlayer;
			} else {
				matchedPlayer = this.players.find(player => player.shirt === searchPlayer.shirt);
				if (matchedPlayer && similarity(matchedPlayer.name, searchPlayer.name) <= 0.5) {
					this.logger.warn(`Match ${matchedPlayer.name} with ${searchPlayer.name} by shirt`);
					result[searchPlayer.id] = matchedPlayer;
				} else {
					this.logger.warn(`${searchPlayer.team} Not able to find ${searchPlayer.name}`);
					result[searchPlayer.id] = null;
				}
			}
		}
		return result;
	}
}
