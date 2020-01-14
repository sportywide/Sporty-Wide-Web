import { getUser } from '@web/shared/lib/store';

export const metaMiddleware = store => next => {
	return action => {
		if (typeof action !== 'object') {
			return next(action);
		}
		const user = getUser(store);
		next({
			...action,
			meta: {
				...(action.meta || {}),
				user,
			},
		});
	};
};
