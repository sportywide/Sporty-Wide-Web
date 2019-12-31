import { Fixture } from '@schema/fixture/models/fixture.entity';
import { cleanup, setupDatabaseModule } from '@schema-test/setup';
import { TestingModule } from '@nestjs/testing';
import { FixtureService } from '@schema/fixture/services/fixture.service';
import { Team } from '@schema/team/models/team.entity';
import { Player } from '@schema/player/models/player.entity';
import { League } from '@schema/league/models/league.entity';
import { TeamService } from '@schema/team/services/team.service';
import { createSpyObj } from 'jest-createspyobj';
import { Connection, QueryRunner } from 'typeorm';
import { PlayerRatingSchema } from '@schema/player/models/player-rating.schema';

describe('Testing fixture service', () => {
	let fixtureService: FixtureService;
	let queryRunner: QueryRunner;
	let module: TestingModule;
	beforeAll(async () => {
		module = await setupDatabaseModule({
			entities: [Fixture, Team, Player, League],
			providers: [FixtureService, TeamService],
			schemas: {
				PlayerRating: PlayerRatingSchema,
			},
		})
			.overrideProvider(TeamService)
			.useValue(createSpyObj(TeamService))
			.compile();
		fixtureService = module.get(FixtureService);
	});

	beforeEach(async () => {
		const connection = module.get(Connection);
		queryRunner = connection.createQueryRunner();
		await queryRunner.startTransaction();
	});

	afterEach(async () => {
		await queryRunner.rollbackTransaction();
	});

	afterAll(async () => {
		await cleanup(module);
	});
	describe('#getNextPendingMatch', () => {
		it('should return the next pending match', async () => {
			await fixtureService.getNextPendingMatch();
		});
	});
	describe('#hasActiveMatches', () => {
		it('should whether or not there is an active match', async () => {
			await fixtureService.hasActiveMatches();
		});
	});
	describe('#getNextFixtures', () => {
		it('should return the next matches for specified teams', async () => {
			await fixtureService.getNextFixtures([9, 1]);
		});
	});
});
