import { Fixture } from '@schema/fixture/models/fixture.entity';
import { Connection } from 'typeorm';
import { setupDatabaseModule } from '@schema-test/setup';
import { Player } from '@schema/player/models/player.entity';
import { PlayerService } from '@schema/player/services/player.service';
import { Team } from '@schema/team/models/team.entity';
import { TestingModule } from '@nestjs/testing';
import { League } from './../../league/models/league.entity';
const formation = require('@shared/lib/strategy/4-4-2');

describe('Testing player service', () => {
	let playerService: PlayerService;
	let module: TestingModule;
	beforeAll(async () => {
		module = await setupDatabaseModule({
			entities: [Player, Team, Fixture, League],
			providers: [PlayerService],
		}).compile();
		playerService = module.get(PlayerService);
	});

	afterAll(async () => {
		const connection = module.get(Connection);
		await connection.close();
	});
	describe('#generateRandomPlayers', () => {
		it('should generate players in the rating range', async () => {
			const details = {
				leagueId: 19,
				maxRating: 80,
				minRating: 70,
				numPlayers: 2,
			};
			const players = await playerService.generatePlayersInRange(details);
			expect(players.length).toBe(2);
			for (const player of players) {
				expect(player.rating).toBeLessThanOrEqual(details.maxRating);
				expect(player.rating).toBeGreaterThanOrEqual(details.minRating);
				expect(player.team && player.team.leagueId).toEqual(details.leagueId);
			}
		});

		it('should generate players with position', async () => {
			const details = {
				leagueId: 19,
				maxRating: 80,
				minRating: 70,
				numPlayers: 2,
				position: 'GK',
			};
			const players = await playerService.generatePlayersInRange(details);
			expect(players.length).toBe(2);
			for (const player of players) {
				expect(player.rating).toBeLessThanOrEqual(details.maxRating);
				expect(player.rating).toBeGreaterThanOrEqual(details.minRating);
				expect(player.positions).toContain(details.position);
				expect(player.team && player.team.leagueId).toEqual(details.leagueId);
			}
		});
	});

	describe('#generateFormation', () => {
		it('should generate a correct random formation', async () => {
			const players = await playerService.generateFormation({
				formation,
				leagueId: 19,
				date: new Date('2019-10-25 00:00:00Z'),
			});

			expect(players.length).toBe(15);
		});
	});
});
