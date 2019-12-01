import https from 'https';
import { Inject, Service } from 'typedi';
import { ApolloClient } from 'apollo-client';
import axios, { Axios } from 'axios-observable';
import { createHttpLink } from 'apollo-link-http';
import { COOKIE_CSRF, HEADER_SERVER_SIDE } from '@web/api/auth/constants';
import { createRefreshTokenInterceptor } from '@web/shared/lib/http/refresh-token';
import { BehaviorSubject, Subject } from 'rxjs';
import { getHeaders, parseContext, setAuthCookies } from '@web/shared/lib/auth/helper';
import { isBrowser } from '@web/shared/lib/environment';
import { filterValues } from '@shared/lib/utils/object/filter';
import { logout, setAuth } from '@web/features/auth/store/actions';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { autobind } from 'core-decorators';
import { axiosFetch } from '@web/shared/lib/http/axios-fetch';

@Service()
export class ApiService {
	private readonly apiBase: Axios;
	private readonly authBase: Axios;
	private apiCallSubscription = new BehaviorSubject<number>(0);
	private apiErrorSubscription = new Subject<Error>();
	private refreshTokenCall: any;
	private readonly apolloClient: ApolloClient<any>;

	constructor(
		@Inject('baseUrl') private readonly baseUrl: string,
		@Inject('context') private readonly context,
		@Inject('store') private readonly store
	) {
		this.apiBase = this.restClient(`${baseUrl}/api`);
		this.authBase = this.restClient(`${baseUrl}/auth`);
		this.apolloClient = this.graphqlClient(this.apiBase);
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

	graphql() {
		return this.apolloClient;
	}

	@autobind
	private retryCall() {
		return () => {
			if (this.refreshTokenCall) {
				return this.refreshTokenCall;
			}
			const headers = {};
			const isServerSide = this.context.req && this.context.res;
			if (isServerSide) {
				headers[HEADER_SERVER_SIDE] = 1;
			}
			this.refreshTokenCall = this.authBase
				.post('/refresh-token', undefined, {
					headers,
				})
				.toPromise()
				.then(result => {
					const tokens = result.data;
					if (isServerSide && tokens) {
						setAuthCookies({ request: this.context.req, response: this.context.res }, tokens);
					}
					this.store.dispatch(setAuth(parseContext(this.context)));
					return {
						tokens,
						headers: tokens && {
							Authorization: `Bearer ${tokens.accessToken}`,
							'Refresh-Token': tokens.refreshToken,
						},
					};
				})
				.finally(() => {
					this.refreshTokenCall = null;
				});
			return this.refreshTokenCall;
		};
	}

	@autobind
	private refreshTokenFailed() {
		this.store.dispatch(logout());
	}

	private restClient(url) {
		let axiosInstance = axios.create({
			baseURL: url,
			xsrfCookieName: COOKIE_CSRF,
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			headers: this.getHeaders(),
		});
		axiosInstance = createRefreshTokenInterceptor(axiosInstance, this.retryCall(), this.refreshTokenFailed);

		if (isBrowser()) {
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
		}
		return axiosInstance;
	}

	private graphqlClient(axiosInstance) {
		return new ApolloClient({
			ssrMode: this.context.req,
			link: createHttpLink({
				uri: `${this.baseUrl}/api/graphql`,
				headers: this.getHeaders(),
				fetch: axiosFetch(axiosInstance),
			}),
			cache: new InMemoryCache(),
		});
	}

	private getHeaders() {
		let headers = getHeaders(this.context.req);
		if (headers) {
			headers = axios.defaults.headers = filterValues(headers, value => {
				return value != undefined;
			});
		}
		return headers;
	}
}
