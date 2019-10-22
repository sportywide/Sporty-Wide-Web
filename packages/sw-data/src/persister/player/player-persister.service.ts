import { Injectable, Inject } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { User } from '@schema/user/models/user.entity';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { Player } from '@schema/player/models/player.entity';
import path from 'path';
import fs from 'fs';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { Logger } from '@root/node_modules/log4js';

@Injectable()
export class PlayerPersisterService {
	constructor(
		@Inject(DATA_LOGGER) private readonly logger: Logger,
		@InjectSwRepository(User) private readonly userRepository: SwRepository<User>,
		@InjectSwRepository(Player) private readonly playerRepository: SwRepository<Player>
	) {}

	findUsers() {
		return this.userRepository.find();
	}

	async savePlayers() {
		const resourceRoot = path.join(__dirname, 'resources');
		fs.readdirSync(resourceRoot)
			.filter(file => !!file && file.indexOf('player') === 0)
			.forEach(file => {
				this.logger.info(`Reading from resource ${file}`);
				// eslint-disable-next-line import/dynamic-import-chunkname
				fs.readFile(path.join(resourceRoot, file), 'utf8', (err, content) => {
					if (!!err) {
						this.logger.error(err);
						return;
					}

					const players = JSON.parse(content);
					players.forEach(async player => {
						const dbObj = {
							...player,
							id: player.fifaId,
							nationality: player.nationality.title,
							nationalityId: player.nationality.fifaId,
							positions: JSON.stringify(player.positions),
							team: player.team.title,
							teamId: player.team.fifaId,
						};
						delete dbObj['fifaId'];
						await this.playerRepository.save(dbObj);
						this.logger.info(`Persisted player ${dbObj.name} from ${dbObj.team}`);
					});
				});
			});
	}
}
