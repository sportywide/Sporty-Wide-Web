export const observableToPromiseMiddleware = store => next => {
	const pending = {};
	return action => {
		let returned;
		if (action.meta && action.meta.lifecycle) {
			returned = new Promise((resolve, reject) => {
				pending[action.meta.lifecycle.resolve] = resolve;
				pending[action.meta.lifecycle.reject] = reject;
			});
			next(action);
		} else {
			returned = next(action);
		}

		// Success/Error action is dispatched
		if (pending[action.type]) {
			const resolveOrReject = pending[action.type];
			delete pending[action.type];
			resolveOrReject(action);
		}
		return returned;
	};
};
