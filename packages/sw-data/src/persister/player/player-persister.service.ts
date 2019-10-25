import path from 'path';
import util from 'util';
import { Injectable, Inject } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { fsPromise } from '@shared/lib/utils/promisify/fs';
import { Player } from '@schema/player/models/player.entity';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
const glob = util.promisify(require('glob'));

@Injectable()
export class PlayerPersisterService {
	constructor(
		@Inject(DATA_LOGGER) private readonly logger: Logger,
		@InjectSwRepository(Player) private readonly playerRepository: SwRepository<Player>
	) {}

	async savePlayersFromPlayerInfoFiles() {
		try {
			const files = await glob('fifa*.json', {
				cwd: path.resolve(process.cwd(), 'resources', 'players'),
				absolute: true,
			});
			await Promise.all(files.map(file => this.saveFifaPlayerFile(file)));
		} catch (e) {
			this.logger.error(`Failed to read player files`, e);
		}
	}

	private async saveFifaPlayerFile(file) {
		try {
			this.logger.info(`Reading from resource ${file}`);
			const content = await fsPromise.readFile(file, 'utf8');

			const players = JSON.parse(content);
			await Promise.all(
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
					try {
						await this.playerRepository.save(dbObj);
						this.logger.trace(`Persisted player ${dbObj.name} from ${dbObj.team}`);
					} catch (e) {
						this.logger.error(`Failed to save player ${dbObj.name}`);
					}
				})
			);
		} catch (e) {
			this.logger.error('Failed to read file', e);
		}
	}
}
