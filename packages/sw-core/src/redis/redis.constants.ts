export function refreshTokenKey(userId: number) {
	return `sw:refresh_token:${userId}`;
}

export function forgotPasswordKey(userId: number) {
	return `sw:forgot_password:${userId}`;
}

export function verifyEmailKey(userId: number) {
	return `sw:verify_email:${userId}`;
}
