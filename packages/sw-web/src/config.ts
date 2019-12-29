require('@shared/lib/utils/env/dotenv').default.config();
/* eslint-disable */
export const config = {
	default: {
		port: 3000,
	},
	development: {
		cookie_secret: 'testsecret',
		server_url: 'http://192.168.50.1:5000',
		logging: {
			level: 'DEBUG',
		},
	},
	production: {
		cookie_secret: process.env.SW_COOKIE_SECRET,
		server_url: 'https://api.sportywide.com',
		logging: {
			level: 'INFO',
			logz: {
				token: process.env.SW_LOGZ_TOKEN,
			},
		},
	},
};
