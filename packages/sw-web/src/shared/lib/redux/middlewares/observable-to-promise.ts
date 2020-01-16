export const observableToPromiseMiddleware = () => next => {
	const pending = {};
	return action => {
		let returned;
		if (action.meta && action.meta.lifecycle) {
			returned = new Promise((resolve, reject) => {
				pending[action.meta.lifecycle.resolve] = { handle: resolve, error: false };
				pending[action.meta.lifecycle.reject] = { handle: reject, error: true };
			});
			next(action);
		} else {
			returned = next(action);
		}

		// Success/Error action is dispatched
		if (pending[action.type]) {
			const resolveOrReject = pending[action.type];
			delete pending[action.type];
			if (resolveOrReject.error) {
				resolveOrReject.handle(new Error(`Error in observable to promise middleware ${String(action.type)}`));
			} else {
				resolveOrReject.handle(action);
			}
		}
		return returned;
	};
};
