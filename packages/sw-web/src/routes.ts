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
		name: 'confirm-social',
		pattern: '/confirm-social',
		page: 'auth/confirm-social',
	},
	{
		name: 'confirm-email',
		pattern: '/confirm-email',
		page: 'auth/confirm-email',
	},
	{
		name: 'forgot-password',
		pattern: '/forgot-password',
		page: 'auth/forgot-password',
	},
	{
		name: 'reset-password',
		pattern: '/reset-password',
		page: 'auth/reset-password',
	},
	{
		name: 'profile-edit',
		pattern: '/profile/edit',
		page: 'profile/edit',
	},
	{
		name: 'play-league',
		pattern: '/play-league/:id',
		page: 'league/play-league',
	},
	{
		name: 'lineup-builder',
		pattern: '/lineup-builder/:id',
		page: 'lineup/builder',
	},
	{
		name: 'user-leagues',
		pattern: '/user-leagues',
		page: 'league/user-leagues',
	},
	{
		name: 'fixture-details',
		pattern: '/fixture/:id',
		page: 'fixture/details',
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
	if (!routeName) {
		return routeName;
	}
	const routeMapping = routeMappings.find(route => route.name === routeName);
	return (routeMapping && routeMapping.pattern) || `/${routeName}`;
}
