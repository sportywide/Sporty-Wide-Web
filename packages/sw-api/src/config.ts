require('@shared/lib/utils/env/dotenv').default.config();
/* eslint-disable */
export const config = {
	default: {
		port: 5000,
		auth: {
			google: {
				client_id: '431025632688-734iamf9chepek4sdeh0r4r8m5e8m74v.apps.googleusercontent.com',
				client_secret: process.env.SW_GOOGLE_CLIENT_SECRET,
			},
			facebook: {
				client_id: '676534372837849',
				client_secret: process.env.SW_FACEBOOK_CLIENT_SECRET,
			},
			forgot_password_expiration_time: 24 * 60 * 60,
			verify_email_expiration_time: 48 * 60 * 60,
		},
	},
	development: {
		auth: {
			access_token_expiration_time: 60 * 60,
			refresh_token_expiration_time: 60 * 60 * 24 * 30,
			jwt: {
				secret_key: 'jwtsecret',
			},
		},
	},
	production: {
		auth: {
			access_token_expiration_time: 15 * 60,
			refresh_token_expiration_time: 60 * 60 * 24 * 30,
			jwt: {
				secret_key: process.env.SW_JWT_SECRET,
			},
		},
	},
};
