import { Injectable, Inject } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { Team } from '@schema/team/models/team.entity';
import fs from 'fs';
import path from 'path';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { Logger } from '@root/node_modules/log4js';

@Injectable()
export class TeamPersisterService {
	constructor(
		@Inject(DATA_LOGGER) private readonly logger: Logger,
		@InjectSwRepository(Team) private readonly teamRepository: SwRepository<Team>
	) {}

	saveTeams() {
		const resourceRoot = path.join(__dirname, 'resources');
		fs.readdirSync(resourceRoot)
			.filter(file => !!file && file.indexOf('team') === 0)
			.forEach(file => {
				this.logger.info(`Reading from resource ${file}`);
				// eslint-disable-next-line import/dynamic-import-chunkname
				fs.readFile(path.join(resourceRoot, file), 'utf8', (err, content) => {
					if (!!err) {
						this.logger.error(err);
						return;
					}

					const teams = JSON.parse(content);
					teams.forEach(async team => {
						const dbObj = {
							...team,
							id: team.fifaId,
							league: team.league.title,
							leagueId: team.league.fifaId,
						};
						delete dbObj['fifaId'];
						await this.teamRepository.save(dbObj);
						this.logger.info(`Persisted team ${dbObj.title} from ${dbObj.league}`);
					});
				});
			});
	}
}
