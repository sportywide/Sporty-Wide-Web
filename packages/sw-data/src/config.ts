require('dotenv').config();
export const config = {
	development: {
		postgres: {
			url: '192.168.50.10',
			username: process.env.SW_POSTGRES_USER,
			password: process.env.SW_POSTGRES_PASSWORD,
			port: 5432,
			database: process.env.SW_POSTGRES_DB,
		},
		puppeteer: {
			executable: '/usr/bin/chromium-browser',
		},
		proxy: {
			url: 'http://localhost:8081',
		},
	},
};
