export function logout(req, res) {
	for (const cookieName of Object.keys(req.cookies || {})) {
		res.clearCookie(cookieName);
	}
	res.end();
}
