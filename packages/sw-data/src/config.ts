/* eslint-disable @typescript-eslint/camelcase */
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
		rapidapi: {
			api_key: [
				'146c159443mshef8c4d9a0ff13bep1ff757jsn61807079a373',
				'ad2cb35fdamsh8523849c5b78cf4p19069ejsn777712d8220a',
			],
		},
	},
};
