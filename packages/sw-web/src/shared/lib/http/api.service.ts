import { Service, Inject } from 'typedi';
import https from 'https';
import axios, { Axios } from 'axios-observable';
import { COOKIE_CSRF } from '@web/api/auth/constants';
import { createRefreshTokenInterceptor } from '@web/shared/lib/http/refresh-token';

@Service({ global: true })
export class ApiService {
	private readonly apiBase: Axios;
	private readonly authBase: Axios;

	constructor(@Inject('baseUrl') private baseUrl: string) {
		this.apiBase = axios.create({
			baseURL: `${baseUrl}/api`,
			xsrfCookieName: COOKIE_CSRF,
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
		});

		this.authBase = axios.create({
			baseURL: `${baseUrl}/auth`,
			xsrfCookieName: COOKIE_CSRF,
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
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
