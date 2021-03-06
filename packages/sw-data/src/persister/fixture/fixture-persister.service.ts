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
import { defaultFuzzyOptions } from '@shared/lib/data/data.constants';

const glob = util.promisify(require('glob'));

@Injectable()
export class FixturePersisterService {
	constructor(
		@Inject(DATA_LOGGER) private readonly logger: Logger,
		@InjectSwRepository(Fixture) private readonly fixtureRepository: SwRepository<Fixture>,
		@InjectSwRepository(Team) private readonly teamRepository: SwRepository<Team>
	) {}

	async saveFixturesFromFiles() {
		try {
			const files = await glob('*.json', {
				cwd: path.resolve(process.cwd(), 'resources', 'fixtures'),
				absolute: true,
			});
			await Promise.all(
				files.map(async file => {
					try {
						this.logger.info(`Reading from resource ${file}`);
						const content = await fsPromise.readFile(file, 'utf8');
						const fixtures = JSON.parse(content);
						await this.saveFixtures(fixtures);
					} catch (e) {
						this.logger.error('Failed to read file', e);
					}
				})
			);
		} catch (e) {
			this.logger.error(`Failed to read fixture files`, e);
		}
	}

	async saveFixtures(fixtures) {
		const fuzzyOptions = {
			...defaultFuzzyOptions,
			keys: ['title', 'alias'],
		};
		const { id: leagueId, matches, season } = fixtures;
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
				const awayTeam = teamCache[match.away] || fuse.search(match.away)[0];
				if (!homeTeam) {
					this.logger.error('Not able to find team', match.home);
					return;
				}
				if (!awayTeam) {
					this.logger.error('Not able to find team', match.away);
					return;
				}
				if (!teamCache[match.home]) {
					this.logger.debug(`Matching ${match.home} with ${homeTeam.title}`);
				}
				if (!teamCache[match.away]) {
					this.logger.debug(`Matching ${match.away} with ${awayTeam.title}`);
				}
				teamCache[match.home] = homeTeam;
				teamCache[match.away] = awayTeam;

				const dbObj = {
					id: parseInt(this.getMatchId(match.link), 10),
					link: match.link,
					home: homeTeam.title,
					away: awayTeam.title,
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
					await this.fixtureRepository.upsert({ object: dbObj });
				} catch (e) {
					this.logger.error(`Failed to save fixture ${dbObj.link}`, e);
				}
			})
		);

		await this.updateFixtureNumbers(leagueId, season);
	}

	private async updateFixtureNumbers(leagueId, season) {
		const fixtures = await this.fixtureRepository.find({
			where: {
				season,
				leagueId,
			},
			order: {
				time: 'ASC',
			},
		});
		const fixtureCountMap = {};
		for (const fixture of fixtures) {
			fixtureCountMap[fixture.homeId] = (fixtureCountMap[fixture.homeId] || 0) + 1;
			fixtureCountMap[fixture.awayId] = (fixtureCountMap[fixture.awayId] || 0) + 1;
			fixture.homeFixture = fixtureCountMap[fixture.homeId];
			fixture.awayFixture = fixtureCountMap[fixture.awayId];
		}
		return this.fixtureRepository.save(fixtures);
	}

	private getMatchId(link) {
		const match = link.match(/\d+$/);
		return match ? match[0] : null;
	}
}
