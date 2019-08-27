import Routes from 'next-routes';

const routeMappings = [
	{
		name: 'login',
		pattern: '/login',
		page: 'auth/login',
	},
	{
		name: 'home',
		pattern: '/home',
		page: 'index',
	},
	{
		name: 'signup',
		pattern: '/signup',
		page: 'auth/signup',
	},
	{
		name: 'confirm_social',
		pattern: '/confirm_social',
		page: 'auth/confirm-social',
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
	return (routeMapping && routeMapping.pattern) || `/${routeName}`;
}
