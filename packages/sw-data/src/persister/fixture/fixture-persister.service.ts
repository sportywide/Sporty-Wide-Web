import path from 'path';
import util from 'util';
import { Inject, Injectable } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { fsPromise } from '@shared/lib/utils/promisify/fs';
import { Player } from '@schema/player/models/player.entity';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { Fixture } from '@schema/fixture/models/fixture.entity';

const glob = util.promisify(require('glob'));

@Injectable()
export class FixturePersisterService {
	constructor(
		@Inject(DATA_LOGGER) private readonly logger: Logger,
		@InjectSwRepository(Player) private readonly fixtureRepository: SwRepository<Fixture>
	) {}

	async saveFixtures() {
		try {
			const files = await glob('*.json', {
				cwd: path.resolve(__dirname, 'resources', 'fixtures'),
				absolute: true,
			});
			await Promise.all(files.map(file => this.saveFile(file)));
		} catch (e) {
			this.logger.error(`Failed to read fixture files`, e);
		}
	}

	private async saveFile(file) {
		try {
			this.logger.info(`Reading from resource ${file}`);
			const content = await fsPromise.readFile(file, 'utf8');

			const { id: leagueId, matches } = JSON.parse(content);
			await Promise.all(
				matches.map(async match => {
					const dbObj = {};
					try {
						await this.playerRepository.save(dbObj);
						this.logger.debug(`Persisted player ${dbObj.name} from ${dbObj.team}`);
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
