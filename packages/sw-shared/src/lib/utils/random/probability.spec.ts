import { randomCfRange, sumProbability } from '@shared/lib/utils/random/probability';
import { range } from '@shared/lib/utils/array/range';

describe('probability', () => {
	describe('#randomCfRange', () => {
		it('should return correct probabilities', () => {
			expect(sumProbability([20, 30, 50])).toEqual([0.2, 0.3, 0.5]);
			expect(sumProbability([])).toEqual([]);
		});
	});

	describe('#randomCfRange', () => {
		it('should return range in the boundary', () => {
			range(0, 30).forEach(() => {
				const interval = 10;
				const [start, end] = randomCfRange([27, 99], interval);
				expect(end - start).toEqual(interval);
				expect(start).toBeGreaterThanOrEqual(20);
				expect(end).toBeLessThanOrEqual(100);
			});
		});
	});
});
