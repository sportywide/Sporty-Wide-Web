import config from '@web/config';
import { Request } from 'express';
import modifyResponse from 'node-http-proxy-json';
import { COOKIE_CSRF, COOKIE_JWT_PAYLOAD, COOKIE_JWT_SIGNATURE, COOKIE_REFRESH_TOKEN } from '@web/api/auth/constants';
import { isProduction } from '@shared/lib/utils/env';
import { getFullPath, normalizePath } from '@shared/lib/utils/url/format';
import { noop } from '@shared/lib/utils/functions';

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
	'/auth': {
		target: config.get('server_url'),
		changeOrigin: true,
		onProxyReq: function(proxyReq, req) {
			handleAuthHeader(proxyReq, req);
			const path = normalizePath(req.path, 'auth');
			const pathMapping = {
				'/facebook': setReferrerHeader,
				'/facebook/callback': setReferrerHeader,
			};

			const handler = pathMapping[path] || noop;
			handler(proxyReq, req);
		},
		onProxyRes: function(proxyRes, req: Request, res) {
			const path = normalizePath(req.path, 'auth');
			const pathMapping = {
				'/login': setCookies,
				'/signup': setCookies,
				'/refresh_token': setCookies,
				'/facebook/callback': setCookiesAndRedirect,
			};

			const handler = pathMapping[path] || noop;
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
	const jwtPayload = req.cookies[COOKIE_JWT_PAYLOAD];
	const jwtSignature = req.cookies[COOKIE_JWT_SIGNATURE];
	const refreshToken = req.cookies[COOKIE_REFRESH_TOKEN];

	if (jwtPayload && jwtSignature) {
		proxyReq.setHeader('Authorization', `Bearer ${jwtPayload}.${jwtSignature}`);
	}

	if (refreshToken) {
		proxyReq.setHeader('Refresh-Token', refreshToken);
	}
}

function setCookiesAndRedirect(proxyRes, request, response) {
	if (proxyRes.statusCode >= 400) {
		response.redirect('/login');
	}
	setCookies(proxyRes, request, response, '/');
}

function setCookies(proxyRes, request, response, redirectUrl) {
	if (proxyRes.statusCode >= 300) {
		return;
	}

	modifyResponse(response, proxyRes, function(tokens) {
		const { accessToken, refreshToken } = tokens;

		const [header, payload, signature] = accessToken.split('.');

		response.cookie(COOKIE_JWT_PAYLOAD, [header, payload].join('.'), {
			secure: isProduction(),
		});
		response.cookie(COOKIE_JWT_SIGNATURE, signature, {
			httpOnly: true,
			secure: isProduction(),
		});
		response.cookie(COOKIE_REFRESH_TOKEN, refreshToken, {
			httpOnly: true,
			secure: isProduction(),
		});
		response.cookie(COOKIE_CSRF, request.csrfToken(), {
			secure: isProduction(),
		});

		if (redirectUrl) {
			response.status(301);
			response.location(redirectUrl);
		}

		return tokens;
	});
}
