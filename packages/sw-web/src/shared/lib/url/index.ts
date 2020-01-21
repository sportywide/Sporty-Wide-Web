import urlParser from 'url';
import { Router } from '@web/routes';
import { compile } from 'path-to-regexp';

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

export function interpolateUrl(url, vars = {}) {
	const toPath = compile(url, { encode: encodeURIComponent });
	return toPath(vars);
}
