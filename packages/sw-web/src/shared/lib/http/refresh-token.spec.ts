import '@shared/lib/shim/promise';
import nock from 'nock';
import axios from 'axios-observable';
import { createRefreshTokenInterceptor } from '@web/shared/lib/http/refresh-token';
import { noop } from '@shared/lib/utils/functions';

const BASE_PATH = 'https://api.com';

describe('Testing refresh token interceptor', () => {
	test('Should make a call to refresh token endpoint', async () => {
		nock(BASE_PATH)
			.get('/test')
			.reply(401, {
				error: 'Token expired',
			});

		const axiosInstance = axios.create({
			baseURL: BASE_PATH,
		});

		const refreshCall = jest.fn().mockImplementation(() => {
			nock(BASE_PATH)
				.get('/test')
				.reply(200, { success: true });
			return Promise.resolve({ token: 'abc' });
		});

		createRefreshTokenInterceptor(axiosInstance, refreshCall, noop);

		const { data: result } = await axiosInstance.get('/test').toPromise();
		expect(refreshCall).toHaveBeenCalled();
		expect(result).toEqual({ success: true });
	});
});
