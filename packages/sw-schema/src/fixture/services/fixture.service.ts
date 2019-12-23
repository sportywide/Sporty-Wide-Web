import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { BaseEntityService } from '@schema/core/entity/base-entity.service';
import { Fixture } from '@schema/fixture/models/fixture.entity';
import { addDays, addHours, addMonths, addWeeks, format, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { Between, In, MoreThan, Not } from 'typeorm';
import { Logger } from 'log4js';
import { SCHEMA_LOGGER } from '@core/logging/logging.constant';
import { TeamService } from '@schema/team/services/team.service';
import { WhoscoreFixture } from '@shared/lib/dtos/fixture/fixture.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Player } from '@schema/player/models/player.entity';
import { keyBy } from 'lodash';
import { PlayerRatingDocument } from '@schema/player/models/player-rating.schema';

@Injectable()
export class FixtureService extends BaseEntityService<Fixture> {
	constructor(
		@InjectSwRepository(Fixture) private readonly fixtureRepository: SwRepository<Fixture>,
		@InjectSwRepository(Player) private readonly playerRepository: SwRepository<Player>,
		@InjectModel('PlayerRating') private readonly playerRatingModel: Model<PlayerRatingDocument>,
		@Inject(SCHEMA_LOGGER) private readonly logger: Logger,
		private readonly teamService: TeamService
	) {
		super(fixtureRepository);
	}

	hasActiveMatches() {
		return this.fixtureRepository.count({
			where: [
				{ status: Not(In(['FT', 'PENDING'])) },
				{ status: 'PENDING', time: Between(addHours(new Date(), -2), new Date()) },
			],
		});
	}

	async getFixtureDetails(fixtureId: any) {
		const fixture = await this.findById({
			id: fixtureId,
		});

		if (!fixture) {
			throw new NotFoundException('Fixture not found');
		}
		const playerRatings = await this.playerRatingModel.find({
			fixtureId,
		});
		const playerIds = playerRatings.map(playerRating => playerRating.playerId);
		const players = await this.playerRepository.findByIds(playerIds);
		const playerIdMap = keyBy(players, 'id');

		const ratings = {
			home: [],
			away: [],
		};

		for (const playerRating of playerRatings) {
			if (!playerIdMap[playerRating.playerId]) {
				continue;
			}
			const teamId = playerRating.teamId || playerIdMap[playerRating.playerId].teamId;
			const value = {
				player: playerIdMap[playerRating.playerId],
				rating: playerRating,
			};
			if (teamId === fixture.homeId) {
				ratings.home.push(value);
			} else {
				ratings.away.push(value);
			}
		}

		return {
			fixture: fixture,
			ratings,
		};
	}

	getNextPendingMatch() {
		const queryBuilder = this.fixtureRepository.createQueryBuilder();
		queryBuilder.orderBy('time - NOW()', 'ASC');
		queryBuilder.where({
			status: 'PENDING',
			time: MoreThan('NOW()'),
		});
		return queryBuilder.getOne();
	}

	findMatchesForWeek({ leagueId, date = new Date() }) {
		const thisMonday = startOfDay(startOfWeek(date, { weekStartsOn: 1 }));
		const nextMonday = addWeeks(thisMonday, 1);
		const queryBuilder = this.fixtureRepository
			.createQueryBuilder()
			.where('time >= :start AND time < :end AND league_id = :leagueId');
		queryBuilder.setParameters({
			start: thisMonday,
			end: nextMonday,
			leagueId,
		});
		return queryBuilder.getMany();
	}

	findMatchesForLeague({ leagueId, season }) {
		return this.fixtureRepository.find({
			where: {
				leagueId,
				season,
			},
		});
	}

	findMatchesForDay({ leagueId, date }) {
		date = startOfDay(date);
		const today = format(date, 'yyyy-MM-dd');
		const tomorrow = format(addDays(date, 1), 'yyyy-MM-dd');
		return this.fixtureRepository.find({
			where: {
				leagueId,
				time: Between(today, tomorrow),
			},
		});
	}

	findByMonth(leagueId, date = new Date()) {
		date = startOfMonth(startOfDay(date));
		const firstDay = format(date, 'yyyy-MM-dd');
		const lastDay = format(addMonths(date, 1), 'yyyy-MM-dd');
		return this.fixtureRepository.find({
			where: {
				leagueId,
				time: Between(firstDay, lastDay),
			},
		});
	}

	async saveWhoscoreFixtures(
		leagueId: number,
		dbFixtures: Fixture[],
		fixtures: WhoscoreFixture[]
	): Promise<Map<WhoscoreFixture, Fixture>> {
		const dbTeams = await this.teamService.findByLeague(leagueId);
		const mapping = new Map<WhoscoreFixture, Fixture>();
		await Promise.all(
			fixtures.map(async fixture => {
				const homeDbTeam = this.teamService.fuzzySearch(dbTeams, fixture.home);
				if (!homeDbTeam) {
					this.logger.error('Cannot find the team', fixture.home);
					return;
				}
				this.logger.debug(`Matching ${fixture.home} with ${homeDbTeam.title}`);
				const awayDbTeam = this.teamService.fuzzySearch(dbTeams, fixture.away);
				if (!awayDbTeam) {
					this.logger.error('Cannot find the team', fixture.away);
					return;
				}
				this.logger.debug(`Matching ${fixture.away} with ${awayDbTeam.title}`);

				const dbFixture = dbFixtures.find(
					fixture => fixture.awayId === awayDbTeam.id && fixture.homeId === homeDbTeam.id
				);
				if (!dbFixture) {
					this.logger.error(`Cannot find fixture for teams ${fixture.home} - ${fixture.away}`);
					return;
				}
				dbFixture.whoscoreUrl = fixture.link;
				dbFixture.status = fixture.status;
				dbFixture.current = fixture.current;
				dbFixture.incidents = fixture.incidents;
				mapping.set(fixture, dbFixture);
				await this.saveOne(dbFixture);
			})
		);
		return mapping;
	}
}
