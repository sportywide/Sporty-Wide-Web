import Routes from 'next-routes';
declare const module: any;
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
		name: 'confirm-social',
		pattern: '/confirm-social',
		page: 'auth/confirm-social',
	},
	{
		name: 'confirm-email',
		pattern: '/confirm-email',
		page: 'auth/confirm-email',
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
