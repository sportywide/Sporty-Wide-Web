/* eslint @typescript-eslint/camelcase: 0 */

module.exports = {
	port: 5000,
	auth: {
		google: {
			client_id: 'test',
			client_secret: 'secret',
		},
		facebook: {
			client_id: '676534372837849',
			client_secret: '8004a8f3edb0203f4d7a6015e6e7e8c7',
		},
		jwt: {
			secret_key: 'jwtsecret',
			expiration_time: 15 * 60,
		},
	},
};
