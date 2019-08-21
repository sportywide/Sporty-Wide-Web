import cookieParser from 'next-cookies';
import { COOKIE_CSRF, COOKIE_JWT_PAYLOAD } from '@web/api/auth/constants';
import { decodeBase64 } from '@web/shared/lib/encode/encoding';
import { isNode } from '@web/shared/lib/environment';

export function parseCookies(context) {
	if (isNode() && !context.req) {
		return {};
	}
	const cookies = cookieParser(context) || {};

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
