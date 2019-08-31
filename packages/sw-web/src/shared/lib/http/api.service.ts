import { Service } from 'typedi';
import axios, { Axios } from 'axios-observable';
import { COOKIE_CSRF } from '@web/api/auth/constants';
import { createRefreshTokenInterceptor } from '@web/shared/lib/http/refresh-token';

@Service({ global: true })
export class ApiService {
	private readonly apiBase: Axios;
	private readonly authBase: Axios;

	constructor() {
		this.apiBase = axios.create({
			baseURL: '/api',
			xsrfCookieName: COOKIE_CSRF,
		});

		this.authBase = axios.create({
			baseURL: '/auth',
			xsrfCookieName: COOKIE_CSRF,
		});

		const retryCall = () => {
			return this.authBase.post('/refresh-token').toPromise();
		};

		this.apiBase = createRefreshTokenInterceptor(this.apiBase, retryCall);
		this.authBase = createRefreshTokenInterceptor(this.authBase, retryCall);
	}

	api() {
		return this.apiBase;
	}

	auth() {
		return this.authBase;
	}
}
