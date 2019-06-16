/* eslint @typescript-eslint/camelcase: 0 */

module.exports = {
	port: 5000,
	passport: {
		secret_key: 'passportsecret',
	},
	jwt: {
		secret_key: 'jwtsecret',
		expiration_time: 15 * 60,
	},
};
