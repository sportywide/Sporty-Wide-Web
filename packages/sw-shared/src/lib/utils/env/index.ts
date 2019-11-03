export function isProduction(env: string = process.env.NODE_ENV) {
	return env === 'production';
}

export function isDevelopment(env: string = process.env.NODE_ENV) {
	return env === 'development';
}

export function isTesting(env: string = process.env.NODE_ENV) {
	return env === 'test';
}
