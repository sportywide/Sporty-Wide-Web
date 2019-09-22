import { LineupService } from '@web/features/lineup/services/lineup.service';
import players from '@web/features/players/store/epics/players.json';
import { fill } from 'lodash';
import strategy from '@shared/lib/strategy/4-4-2.json';
import { isUnique } from '@shared/lib/utils/array/set';
import { NUM_PLAYERS } from '../store/reducers/lineup-reducer';

describe('Testing LineupService', () => {
	let lineupService: LineupService;
	beforeEach(() => {
		lineupService = new LineupService();
	});
	describe('#fillPositions', () => {
		test('should fill all positions if given an empty lineup', () => {
			const filledPlayers = lineupService.fillPositions({
				players,
				positions: fill(Array(NUM_PLAYERS), null),
				strategy,
			});
			const filledPositions = filledPlayers.map(player => player.positions);
			strategy.formation.forEach((position, index) => {
				expect(filledPositions[index]).toContain(position.name);
			});
			const filledIds = filledPlayers.map(player => player.id);
			expect(isUnique(filledIds)).toBeTruthy();
		});

		test('should fill remaining positions if given an already filled lineup', () => {
			const positions = fill(Array(NUM_PLAYERS), null);
			positions[10] = players[0]; //David De Gea
			positions[0] = players[10]; //Anthony Martial
			const filledPlayers = lineupService.fillPositions({
				players,
				positions,
				strategy,
			});
			const filledPositions = filledPlayers.map(player => player.positions);
			strategy.formation.forEach((position, index) => {
				if (positions[index]) {
					expect(filledPlayers[index]).toEqual(positions[index]);
				}
				expect(filledPositions[index]).toContain(position.name);
			});
			const filledIds = filledPlayers.map(player => player.id);
			expect(isUnique(filledIds)).toBeTruthy();
		});

		test('should try to fit as many as possible given not enough players', () => {
			const filledPlayers = lineupService.fillPositions({
				players: players.slice(0, 5),
				positions: [],
				strategy,
			});
			expect(filledPlayers.filter(player => player).length).toEqual(5);
		});
	});
});
