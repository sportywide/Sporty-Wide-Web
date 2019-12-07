import { defaultFuzzyOptions } from '@data/data.constants';
import Fuse from 'fuse.js';

export function similarity(str1, str2, options = { ...defaultFuzzyOptions, includeScore: true }) {
	const fuse = new Fuse([str1], options);
	const searchResult = fuse.search(str2);
	const bestMatch = searchResult[0];
	return (bestMatch && bestMatch.score) === undefined ? 1 : bestMatch.score;
}
