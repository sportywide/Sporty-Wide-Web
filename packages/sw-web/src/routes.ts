import Routes from 'next-routes';

const routes = new Routes().add({
	name: 'login',
	pattern: '/login',
	page: 'auth/login',
});

export default routes;
export const Link = routes.Link;
export const Router = routes.Router;
