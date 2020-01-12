import urlParser from 'url';
import { noop } from '@shared/lib/utils/functions';
import { Router } from '@web/routes';

export function updateUrl(url) {
	const newUrl = urlParser.format({
		...url,
		search: null,
	});
	return Router.replaceRoute(newUrl, {}, { shallow: true });
}

export function parseUrl(url) {
	return urlParser.parse(url, true);
}

export function updateCurrentUrl(updates) {
	if (typeof window === 'undefined') {
		return;
	}
	let url = parseUrl(window.location.href);
	url = { ...url, ...updates };
	return updateUrl(url);
}

export function interpolateUrl(url, vars) {
	const result = [];

	const urlObject = parseUrl(url);

	urlObject.pathname.split('/:').forEach(function(segment, i) {
		if (i === 0) {
			return result.push(segment);
		} else {
			const segmentMatch = segment.match(/(\w+)(.*)/);
			const key = segmentMatch[1];

			if (vars[key] !== undefined) {
				result.push('/' + vars[key]);
				delete vars[key];
			} else {
				result.push('/:' + key);
			}

			result.push(segmentMatch[2] || '');
		}
	});

	urlObject.pathname = result.join('');
	urlObject.query = {
		...urlObject.query,
		...vars,
	};
	return urlParser.format({
		...urlObject,
		search: null,
	});
}
