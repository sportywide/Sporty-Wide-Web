import cookieParser from 'next-cookies';
import { COOKIE_CSRF, COOKIE_JWT_PAYLOAD, COOKIE_JWT_SIGNATURE, COOKIE_REFRESH_TOKEN } from '@web/api/auth/constants';
import { decodeBase64 } from '@web/shared/lib/encode/encoding';
import { isNode } from '@web/shared/lib/environment';

export function parseContext(context) {
	if (isNode() && !context.req) {
		return {};
	}
	const cookies = cookieParser(context) || {};

	return parseCookies(cookies);
}

export function getHeaders(req) {
	if (!req) {
		return null;
	}
	const jwtPayload = req.cookies[COOKIE_JWT_PAYLOAD];
	const jwtSignature = req.cookies[COOKIE_JWT_SIGNATURE];
	const refreshToken = req.cookies[COOKIE_REFRESH_TOKEN];
	const csrfToken = req.cookies[COOKIE_CSRF];

	return {
		'Refresh-Token': refreshToken,
		Authorization: `Bearer ${jwtPayload}.${jwtSignature}`,
		'XSRF-TOKEN': csrfToken,
	};
}
export function parseCookies(cookies = {}) {
	const jwtPayload = cookies[COOKIE_JWT_PAYLOAD];
	let user;
	if (jwtPayload) {
		const encodedUser = jwtPayload.split('.')[1];
		user = JSON.parse(decodeBase64(encodedUser)).user;
	}
	return {
		csrfToken: cookies[COOKIE_CSRF],
		user,
	};
}
