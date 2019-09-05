import { findPathForRoute, Router } from '@web/routes';

export async function redirect({
	context = {},
	route,
	replace = true,
	refresh,
	params = undefined,
}: {
	context?: any;
	route: string;
	replace?: boolean;
	refresh?: boolean;
	params?: any;
}) {
	if (context && context.res) {
		context.res.writeHead(302, {
			Location: findPathForRoute(route) || '/auth/redirect',
		});
		context.res.end();
	} else {
		if (refresh || !route) {
			const path = findPathForRoute(route);
			const redirectUrl = path ? `/auth/redirect?url=${path}` : '/auth/redirect';
			if (replace) {
				window.location.replace(redirectUrl);
			} else {
				window.location.href = redirectUrl;
			}
		} else {
			const path = findPathForRoute(route);
			route = path ? route : `/${route}`;
			if (replace) {
				return Router.replaceRoute(route, params);
			} else {
				return Router.pushRoute(route, params);
			}
		}
	}
}
