/* eslint-disable @typescript-eslint/camelcase */
require('dotenv').config();
export const config = {
	default: {
		puppeteer: {
			executable: '/usr/bin/chromium-browser',
		},
		proxy: {
			url: '35.244.102.108:8081',
		},
		rapidapi: {
			api_key: [
				'146c159443mshef8c4d9a0ff13bep1ff757jsn61807079a373',
				'ad2cb35fdamsh8523849c5b78cf4p19069ejsn777712d8220a',
			],
		},
		postgres: {
			username: process.env.SW_POSTGRES_USER,
			password: process.env.SW_POSTGRES_PASSWORD,
			port: 5432,
			database: process.env.SW_POSTGRES_DB,
		},
	},
	development: {
		postgres: {
			url: '192.168.50.10',
			username: 'sw-user',
			password: 'sw-password',
			database: 'sportywide',
		},
	},
	production: {
		postgres: {
			url: 'swrds.c81wigl77r6q.ap-southeast-2.rds.amazonaws.com',
		},
	},
};
