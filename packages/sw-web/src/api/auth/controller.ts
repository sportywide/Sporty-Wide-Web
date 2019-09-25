import { COOKIE_REFERRER } from '@web/api/auth/constants';

export function logout(req, res) {
	for (const cookieName of Object.keys(req.cookies || {})) {
		res.clearCookie(cookieName);
	}
	res.end();
}

export function redirect(req, res) {
	const cookies = req.cookies || {};
	const url = req.query.url || cookies[COOKIE_REFERRER];
	const currentHost = req.get('host');
	if (url === cookies[COOKIE_REFERRER]) {
		res.clearCookie(COOKIE_REFERRER);
	}
	if (url && (url.startsWith('/') || new URL(url).host === currentHost)) {
		res.redirect(url);
	} else {
		res.redirect('/');
	}
}
