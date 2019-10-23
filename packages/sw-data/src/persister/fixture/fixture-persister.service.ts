import path from 'path';
import util from 'util';
import { Inject, Injectable } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { fsPromise } from '@shared/lib/utils/promisify/fs';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { Fixture } from '@schema/fixture/models/fixture.entity';
import { Team } from '@schema/team/models/team.entity';
import Fuse from 'fuse.js';

const glob = util.promisify(require('glob'));

@Injectable()
export class FixturePersisterService {
	constructor(
		@Inject(DATA_LOGGER) private readonly logger: Logger,
		@InjectSwRepository(Fixture) private readonly fixtureRepository: SwRepository<Fixture>,
		@InjectSwRepository(Team) private readonly teamRepository: SwRepository<Team>
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
		const fuzzyOptions = {
			shouldSort: true,
			threshold: 0.6,
			location: 0,
			distance: 100,
			keys: ['title'],
		};
		try {
			this.logger.info(`Reading from resource ${file}`);
			const content = await fsPromise.readFile(file, 'utf8');

			const { id: leagueId, matches, season } = JSON.parse(content);
			const teams = await this.teamRepository.find({
				where: {
					leagueId,
				},
			});
			const fuse = new Fuse(teams, fuzzyOptions);
			const teamCache = {};
			await Promise.all(
				matches.map(async match => {
					const homeTeam = teamCache[match.home] || fuse.search(match.home)[0];
					teamCache[match.home] = homeTeam;
					const awayTeam = teamCache[match.away] || fuse.search(match.away)[0];
					teamCache[match.away] = awayTeam;
					if (!homeTeam) {
						this.logger.error('Not able to find team', match.home);
						return;
					}
					if (!awayTeam) {
						this.logger.error('Not able to find team', match.away);
						return;
					}

					const dbObj = {
						id: parseInt(this.getMatchId(match.link), 10),
						link: match.link,
						home: match.home,
						away: match.away,
						homeId: homeTeam.id,
						awayId: awayTeam.id,
						homeScore: match.homeScore,
						awayScore: match.awayScore,
						current: match.current,
						time: new Date(match.time),
						status: match.status,
						season,
						leagueId,
					};

					try {
						await this.fixtureRepository.upsert(dbObj);
					} catch (e) {
						this.logger.error(`Failed to save fixture ${dbObj.link}`, e);
					}
				})
			);
		} catch (e) {
			this.logger.error('Failed to read file', e);
		}
	}

	private getMatchId(link) {
		const match = link.match(/\d+$/);
		return match ? match[0] : null;
	}
}
