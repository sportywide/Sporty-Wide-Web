import { mapKeys } from 'lodash';
import { Axios } from 'axios-observable';

//adapt from https://github.com/lifeomic/axios-fetch/blob/master/src/index.js
export function axiosFetch(axios: Axios) {
	return async (url, options) => {
		const lowerCasedHeaders = mapKeys(options.headers || {}, function(value, key) {
			return key.toLowerCase();
		});

		if (!('content-type' in lowerCasedHeaders)) {
			lowerCasedHeaders['content-type'] = 'text/plain;charset=UTF-8';
		}

		const config = {
			url,
			method: options.method || 'GET',
			data: options.body instanceof FormData ? options.body : String(options.body),
			headers: lowerCasedHeaders,
		};

		const result = await axios.request(config).toPromise();

		// Convert the Axios style response into a `fetch` style response
		const responseBody = typeof result.data === `object` ? JSON.stringify(result.data) : result.data;

		const headers = new Headers();
		Object.entries(result.headers).forEach(function([key, value]) {
			headers.append(key, String(value));
		});

		return new Response(responseBody, {
			status: result.status,
			statusText: result.statusText,
			headers,
		});
	};
}
