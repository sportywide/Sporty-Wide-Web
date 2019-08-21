import Routes from 'next-routes';

const routeMappings = [
	{
		name: 'login',
		pattern: '/login',
		page: 'auth/login',
	},
];

let routes = new Routes();

routeMappings.forEach(routeMapping => {
	routes = routes.add(routeMapping);
});

export default routes;
export const Link = routes.Link;
export const Router = routes.Router;

export function findPathForRoute(routeName) {
	const routeMapping = routeMappings.find(route => route.name === routeName);
	return routeMapping ? routeMapping.pattern || `/${routeName}` : null;
}
