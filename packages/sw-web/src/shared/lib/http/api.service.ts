import https from 'https';
import { Inject, Service } from 'typedi';
import axios, { Axios } from 'axios-observable';
import { COOKIE_CSRF } from '@web/api/auth/constants';
import { createRefreshTokenInterceptor } from '@web/shared/lib/http/refresh-token';
import { BehaviorSubject, Subject } from 'rxjs';
import { getHeaders } from '@web/shared/lib/auth/helper';
import { isBrowser } from '@web/shared/lib/environment';
import { filterValues } from '@shared/lib/utils/object/filter';

@Service({ global: true })
export class ApiService {
	private readonly apiBase: Axios;
	private readonly authBase: Axios;
	private apiCallSubscription = new BehaviorSubject<number>(0);
	private apiErrorSubscription = new Subject<Error>();

	constructor(@Inject('baseUrl') private readonly baseUrl: string, @Inject('context') private readonly context) {
		const headers = getHeaders(context.req);
		if (headers) {
			axios.defaults.headers = filterValues(headers, value => {
				return value != undefined;
			});
		}
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
		if (isBrowser()) {
			this.registerApiSubscriptions();
		}
	}

	subscribeToApiCalls() {
		return this.apiCallSubscription;
	}

	subscribeToError() {
		return this.apiErrorSubscription;
	}

	api() {
		return this.apiBase;
	}

	auth() {
		return this.authBase;
	}

	private registerApiSubscriptions() {
		[this.apiBase, this.authBase].forEach((axiosInstance: Axios) => {
			axiosInstance.interceptors.request.use(config => {
				this.apiCallSubscription.next(this.apiCallSubscription.getValue() + 1);
				return config;
			});
			axiosInstance.interceptors.response.use(
				response => {
					this.apiCallSubscription.next(this.apiCallSubscription.getValue() - 1);
					return response;
				},
				error => {
					this.apiErrorSubscription.next(error);
					this.apiCallSubscription.next(this.apiCallSubscription.getValue() - 1);
					throw error;
				}
			);
		});
	}
}
