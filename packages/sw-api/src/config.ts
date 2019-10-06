require('dotenv').config();
/* eslint-disable */
export const config = {
	default: {
		port: 5000,
	},
	development: {
		auth: {
			google: {
				client_id: '431025632688-734iamf9chepek4sdeh0r4r8m5e8m74v.apps.googleusercontent.com',
				client_secret: process.env.SW_GOOGLE_CLIENT_SECRET,
			},
			facebook: {
				client_id: '676534372837849',
				client_secret: process.env.SW_FACEBOOK_CLIENT_SECRET,
			},
			jwt: {
				secret_key: 'jwtsecret',
				expiration_time: 60 * 60,
			},
		},
	},
};
