import urlParser from 'url';
import { noop } from '@shared/lib/utils/functions';

export function updateUrl({ url, title, data = {} }) {
	const newUrl = urlParser.format({
		...url,
		search: null,
	});
	history.replaceState(data, title, newUrl);
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
	updateUrl({
		url,
		title: null,
	});
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

export function registerUrlChange(onChange) {
	if (typeof window !== 'undefined') {
		const currentPath = window.location.pathname;
		const listener = (event: any) => {
			if (!event.arguments[2]) {
				return;
			}
			const newUrl = parseUrl(event.arguments[2]);
			const newPath = newUrl.pathname;
			if (newPath === currentPath) {
				onChange(newUrl);
			}
		};
		window.addEventListener('replaceState', listener);
		return () => {
			window.removeEventListener('replaceState', listener);
		};
	}

	return noop;
}
