import { findPathForRoute, Router } from '@web/routes';
import { TEMPORARY_REDIRECT } from '@web/shared/lib/http/status-codes';

export async function redirect({
	context = {},
	route,
	replace = false,
	redirect = false,
	refresh,
	params = undefined,
}: {
	context?: any;
	route?: string;
	replace?: boolean;
	redirect?: boolean;
	refresh?: boolean;
	params?: any;
}) {
	if (context && context.res) {
		context.res.location(findPathForRoute(route) || '/auth/redirect');
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
				url = path ? `/auth/redirect?url=${encodeURIComponent(path)}` : '/auth/redirect';
			} else {
				url = path;
			}
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
