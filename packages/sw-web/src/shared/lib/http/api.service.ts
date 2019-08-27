import { Service } from 'typedi';
import axios, { Axios } from 'axios-observable';
import { COOKIE_CSRF } from '@web/api/auth/constants';

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
	}

	api() {
		return this.apiBase;
	}

	auth() {
		return this.authBase;
	}
}
