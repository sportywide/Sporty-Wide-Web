require('dotenv').config();
export const config = {
	development: {
		smtp: {
			host: 'mailhog',
			port: 1025,
		},
		app: {
			url: 'https://www.sportywidedev.com',
		},
	},
};
