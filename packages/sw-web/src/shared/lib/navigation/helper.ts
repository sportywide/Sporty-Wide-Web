import { findPathForRoute, Router } from '@web/routes';

export async function redirect({ context, route, replace = true, params = undefined }) {
	if (context && context.res) {
		context.res.writeHead(302, {
			Location: findPathForRoute(route),
		});
		context.res.end();
	} else {
		if (replace) {
			return Router.replaceRoute(route, params);
		} else {
			return Router.pushRoute(route, params);
		}
	}
}
