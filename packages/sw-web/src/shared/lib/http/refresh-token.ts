import { Axios } from 'axios-observable';
import { UNAUTHENTICATED } from '@web/shared/lib/http/status-codes';

export function createRefreshTokenInterceptor(axios: Axios, refreshTokenCall) {
	const id = axios.interceptors.response.use(
		res => res,
		async error => {
			const statusCodes = [UNAUTHENTICATED];
			if (!error.response || (error.response.status && !statusCodes.includes(+error.response.status))) {
				return Promise.reject(error);
			}

			// Remove the interceptor to prevent a loop
			axios.interceptors.response.eject(id);

			const refreshCall = refreshTokenCall(error);

			const requestQueueInterceptorId = axios.interceptors.request.use(request =>
				refreshCall.then(() => request)
			);

			// When response code is 401 (Unauthorized), try to refresh the token.
			return refreshCall
				.then(() => {
					axios.interceptors.request.eject(requestQueueInterceptorId);
					return axios.request(error.response.config).toPromise();
				})
				.catch(error => {
					axios.interceptors.request.eject(requestQueueInterceptorId);
					return Promise.reject(error);
				})
				.finally(() => createRefreshTokenInterceptor(axios, refreshTokenCall));
		}
	);
	return axios;
}
