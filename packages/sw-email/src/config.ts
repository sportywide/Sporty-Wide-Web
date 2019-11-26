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
};
