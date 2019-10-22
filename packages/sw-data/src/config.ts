require('dotenv').config();
export const config = {
	development: {
		postgres: {
			url: 'localhost',
			username: process.env.SW_POSTGRES_USER,
			password: process.env.SW_POSTGRES_PASSWORD,
			host: 'postgres',
			port: 5432,
			database: process.env.SW_POSTGRES_DB,
		},
		puppeteer: {
			executable: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
		},
		proxy: {
			url: 'http://localhost:8081',
		},
	},
};
