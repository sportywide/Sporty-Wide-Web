import { getConfig } from '@web/config.provider';
import { Request } from 'express';
import modifyResponse from 'node-http-proxy-json';
import { COOKIE_REFERRER, HEADER_SERVER_SIDE } from '@web/api/auth/constants';
import { getFullPath, normalizePath } from '@shared/lib/utils/url/format';
import { noop } from '@shared/lib/utils/functions';
import {
	BAD_REQUEST,
	NOT_FOUND,
	TEMPORARY_REDIRECT,
	UNAUTHENTICATED,
	UNAUTHORIZED,
} from '@web/shared/lib/http/status-codes';
import { getHeaders, setAuthCookies } from '@web/shared/lib/auth/helper';

const config = getConfig();

export const devProxy = {
	'/api': {
		target: config.get('server_url'),
		changeOrigin: true,
		pathRewrite: {
			'^/api': '',
		},
		onProxyReq: function(proxyReq, req) {
			handleAuthHeader(proxyReq, req);
		},
	},
	'/maps': {
		target: 'https://maps.googleapis.com/maps',
		changeOrigin: true,
		pathRewrite: {
			'^/maps': '',
		},
	},
	'/auth': {
		target: config.get('server_url'),
		changeOrigin: true,
		onProxyReq: function(proxyReq, req) {
			handleAuthHeader(proxyReq, req);
			const path = normalizePath(req.path, 'auth');
			const pathMapping = {
				'/facebook': setReferrerHeader,
				'/facebook/callback': setReferrerHeader,
				'/google': setReferrerHeader,
				'/google/callback': setReferrerHeader,
			};

			const handler = pathMapping[path] || noop;
			handler(proxyReq, req);
		},
		onProxyRes: function(proxyRes, req: Request, res) {
			const path = normalizePath(req.path, 'auth');
			const pathMapping = {
				'/login': setCookies,
				'/signup': setCookies,
				'/refresh-token': setCookies,
				'/verify-email': setCookiesAndRedirect,
				'/facebook': redirectOnError,
				'/google': redirectOnError,
				'/facebook/callback': setCookiesAndRedirect,
				'/google/callback': setCookiesAndRedirect,
				'/complete-social-profile': setCookies,
			};
			let handler;
			if (path.startsWith('/reset-password')) {
				handler = setCookies;
			}

			handler = handler || pathMapping[path] || redirectOnError;
			handler(proxyRes, req, res);
		},
	},
};

function setReferrerHeader(proxyReq, req: Request, path?: string) {
	const referrerUrl = getFullPath(req, path, {
		protocol: 'https',
	});
	proxyReq.setHeader('Referrer', referrerUrl);
}

function handleAuthHeader(proxyReq, req: Request) {
	req.cookies = req.cookies || {};
	const headers = getHeaders(req);

	if (!req.get('Authorization') && headers.Authorization) {
		proxyReq.setHeader('Authorization', headers.Authorization);
	}
	if (!req.get('Refresh-Token') && headers['Refresh-Token']) {
		proxyReq.setHeader('Refresh-Token', headers['Refresh-Token']);
	}
}

function setCookiesAndRedirect(proxyRes, request, response, redirectUrl?: string) {
	const cookies = request.cookies || {};
	setCookies(proxyRes, request, response, redirectUrl || cookies[COOKIE_REFERRER] || '/');
}

function setCookies(proxyRes, request, response, redirectUrl) {
	if (proxyRes.statusCode >= 300) {
		return redirectOnError(proxyRes, request, response);
	}

	modifyResponse(response, proxyRes, function(tokens) {
		const { accessToken, refreshToken } = tokens;

		const isServerSide = request.headers[HEADER_SERVER_SIDE];

		if (!isServerSide) {
			setAuthCookies(
				{ request, response },
				{
					accessToken,
					refreshToken,
				}
			);

			if (redirectUrl) {
				if (request.cookies && redirectUrl === request.cookies[COOKIE_REFERRER]) {
					response.clearCookie(COOKIE_REFERRER);
				}
				response.status(TEMPORARY_REDIRECT);
				response.location(redirectUrl);
			}
		}

		return tokens;
	});
}

function redirectOnError(proxyRes, req, res) {
	if (proxyRes.statusCode < 400 || req.method !== 'GET') {
		return;
	}
	modifyResponse(res, proxyRes, function(error) {
		if (error && error.message && proxyRes.statusCode !== NOT_FOUND) {
			res.flash('error', error.message);
		}
		if (req.method === 'GET') {
			res.status(TEMPORARY_REDIRECT);
			if ([NOT_FOUND, UNAUTHORIZED, BAD_REQUEST].includes(proxyRes.statusCode)) {
				res.location('/');
			} else if (proxyRes.statusCode === UNAUTHENTICATED) {
				res.location('/login');
			} else {
				res.location('/error');
			}
		}
		return error;
	});
}
