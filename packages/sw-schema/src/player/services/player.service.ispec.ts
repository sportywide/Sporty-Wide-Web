import { setupDatabaseModule } from '@schema-test/setup';
import { Player } from '@schema/player/models/player.entity';
import { PlayerService } from '@schema/player/services/player.service';
import { Team } from '@schema/team/models/team.entity';

describe('Testing player service', () => {
	let playerService: PlayerService;
	beforeAll(async () => {
		const module = await setupDatabaseModule({
			entities: [Player, Team],
			providers: [PlayerService],
		}).compile();
		playerService = module.get(PlayerService);
	});
	describe('#generateRandomPlayers', () => {
		it('should generate players in the rating range', async () => {
			const players = await playerService.generatePlayersInRange({
				leagueId: 19,
				maxRating: 80,
				minRating: 70,
				numPlayers: 2,
			});
			expect(players.length).toBe(2);
		});
	});
});
