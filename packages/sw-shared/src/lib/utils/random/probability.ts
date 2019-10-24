import { sum } from 'lodash';
import { range } from '@shared/lib/utils/array/range';

export function sumProbability(arr) {
	const total = sum(arr);
	return arr.map(num => num / total);
}

export function cdfSumProbability(arr) {
	const probabilities = sumProbability(arr).sort((a, b) => b - a);
	let current = 0;
	return probabilities.map(probability => (current += probability));
}

export function randomCfRange(boundary: [number, number], interval = 5) {
	let [start, end] = boundary;
	start = start - (start % interval);
	end = end + (interval - (end % interval));

	const probabilities = cdfSumProbability(range(start, end, interval).map(number => end - number));
	const randomNum = Math.random();

	const index = probabilities.findIndex(probability => probability > randomNum);
	return [start + index * interval, start + (index + 1) * interval];
}
