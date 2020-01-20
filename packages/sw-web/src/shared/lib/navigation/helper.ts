import { findPathForRoute, Router } from '@web/routes';
import { TEMPORARY_REDIRECT } from '@web/shared/lib/http/status-codes';
import { interpolateUrl } from '@web/shared/lib/url';

export async function redirect({
	context = {},
	route,
	replace = false,
	redirect = false,
	refresh,
	params = {},
}: {
	context?: any;
	route?: string;
	replace?: boolean;
	redirect?: boolean;
	refresh?: boolean;
	params?: any;
}) {
	if (context && context.res) {
		let url = findPathForRoute(route) || '/auth/redirect';
		url = interpolateUrl(url, params);
		context.res.location(url);
		context.res.status(TEMPORARY_REDIRECT);
		if (context.res.originalEnd) {
			context.res.originalEnd();
		} else {
			context.res.end();
		}
	} else {
		if (refresh) {
			const path = findPathForRoute(route);
			let url;
			if (!route || redirect) {
				url = '/auth/redirect';
				if (path) {
					params = { ...params, url: path };
				}
			} else {
				url = path;
			}
			url = interpolateUrl(url, params);
			if (replace) {
				window.location.replace(url);
			} else {
				window.location.href = url;
			}
		} else {
			if (replace) {
				return Router.replaceRoute(route, params);
			} else {
				return Router.pushRoute(route, params);
			}
		}
	}
}

export function to404() {
	return redirect({
		refresh: true,
		replace: true,
		route: '/404',
	});
}
