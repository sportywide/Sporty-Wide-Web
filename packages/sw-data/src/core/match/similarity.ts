import { defaultFuzzyOptions } from '@data/data.constants';
import Fuse from 'fuse.js';
import { unaccent } from '@shared/lib/utils/string/conversion';

export function similarity(str1, str2, options = { ...defaultFuzzyOptions, includeScore: true, threshold: 0.7 }) {
	const fuse = new Fuse([unaccent(str1)], options);
	const searchResult = fuse.search(unaccent(str2));
	const bestMatch = searchResult[0];
	return (bestMatch && bestMatch.score) === undefined ? 1 : bestMatch.score;
}
