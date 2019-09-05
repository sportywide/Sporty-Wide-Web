/* eslint @typescript-eslint/camelcase: 0 */

module.exports = {
	port: 5000,
	auth: {
		google: {
			client_id: '431025632688-734iamf9chepek4sdeh0r4r8m5e8m74v.apps.googleusercontent.com',
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
		},
		facebook: {
			client_id: '676534372837849',
			client_secret: process.env.FACEBOOK_CLIENT_SECRET,
		},
		jwt: {
			secret_key: 'jwtsecret',
			expiration_time: 15 * 60,
		},
	},
};
