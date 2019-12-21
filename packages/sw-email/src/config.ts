require('@shared/lib/utils/env/dotenv').config();
export const config = {
	development: {
		smtp: {
			host: '192.168.50.10',
			port: 1025,
		},
		app: {
			url: 'https://www.sportywidedev.com',
		},
	},
	production: {
		smtp: {
			host: 'smtp.mailgun.org',
			port: 465,
			user: process.env.SW_SMTP_USER,
			password: process.env.SW_SMTP_PASSWORD,
		},
		app: {
			url: 'https://www.sportywide.com',
		},
	},
};
