import util from 'util';
import path from 'path';
import { Injectable, Inject } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { Team } from '@schema/team/models/team.entity';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { fsPromise } from '@shared/lib/utils/promisify/fs';
const glob = util.promisify(require('glob'));

@Injectable()
export class TeamPersisterService {
	constructor(
		@Inject(DATA_LOGGER) private readonly logger: Logger,
		@InjectSwRepository(Team) private readonly teamRepository: SwRepository<Team>
	) {}

	async saveTeamsFromFifaInfoFiles() {
		try {
			const files = await glob('team.*.json', {
				cwd: path.resolve(__dirname, 'resources', 'teams'),
				absolute: true,
			});
			await Promise.all(files.map(file => this.saveFifaTeamFile(file)));
		} catch (e) {
			this.logger.error(`Failed to read team files`, e);
		}
	}

	private async saveFifaTeamFile(file) {
		try {
			this.logger.info(`Reading from resource ${file}`);
			const content = await fsPromise.readFile(file, 'utf8');

			const teams = JSON.parse(content);
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
						await this.teamRepository.save(dbObj);
						this.logger.trace(`Persisted team ${dbObj.name}`);
					} catch (e) {
						this.logger.error(`Failed to save team ${dbObj.name}`);
					}
				})
			);
		} catch (e) {
			this.logger.error('Failed to read file', e);
		}
	}
}
