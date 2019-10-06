import path from 'path';
import { Axios } from 'axios-observable';
import { UNAUTHENTICATED } from '@web/shared/lib/http/status-codes';

export function createRefreshTokenInterceptor(axios: Axios, refreshTokenCall) {
	const statusCodes = [UNAUTHENTICATED];
	const id = axios.interceptors.response.use(
		async res => {
			if (
				!(res.config.url || '').endsWith('/api/graphql') ||
				res.data.data ||
				!(res.data.errors && res.data.errors.length)
			) {
				return res;
			}
			const [error = {}] = res.data.errors || [];
			if (error.message && statusCodes.includes(error.message.statusCode)) {
				return retryRequest(res.config);
			}
			return res;
		},
		async error => {
			if (!error.response || (error.response.status && !statusCodes.includes(+error.response.status))) {
				return Promise.reject(error);
			}

			return retryRequest(error.response.config);
		}
	);
	return axios;

	function retryRequest(config) {
		// Remove the interceptor to prevent a loop
		axios.interceptors.response.eject(id);

		const refreshCall = refreshTokenCall();

		const requestQueueInterceptorId = axios.interceptors.request.use(request => refreshCall.then(() => request));

		// When response code is 401 (Unauthorized), try to refresh the token.
		return refreshCall
			.then(() => {
				axios.interceptors.request.eject(requestQueueInterceptorId);
				let url;
				if (config.url.startsWith(config.baseUrl)) {
					url = path.relative(config.baseURL, config.url);
				} else {
					url = config.url;
				}
				return axios
					.request({
						...config,
						url,
					})
					.toPromise();
			})
			.catch(error => {
				axios.interceptors.request.eject(requestQueueInterceptorId);
				return Promise.reject(error);
			})
			.finally(() => {
				createRefreshTokenInterceptor(axios, refreshTokenCall);
			});
	}
}
