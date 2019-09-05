import fs from 'fs';
import { getArguments, nothing } from '@shared/lib/utils/functions/index';

describe('Testing getArguments', () => {
	test('should return empty array for no arguments', () => {
		expect(getArguments(nothing)).toEqual([]);
	});

	test('should return correct argument names', () => {
		expect(getArguments(fs.accessSync)).toEqual(['path', 'mode']);
	});
});
