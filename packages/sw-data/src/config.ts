/* eslint-disable @typescript-eslint/camelcase */
require('@shared/lib/utils/env/dotenv').config();
export const config = {
	default: {
		puppeteer: {
			executable: process.env.SW_PUPPETEER_EXECUTABLE,
		},
		proxy: {
			url: 'http://35.244.96.23:9300',
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
		mongo: {
			username: process.env.SW_MONGO_USER,
			password: process.env.SW_MONGO_PASSWORD,
			database: process.env.SW_MONGO_DB,
		},
	},
	development: {
		postgres: {
			host: '192.168.50.10',
			username: 'sw-user',
			password: 'sw-password',
			database: 'sportywide',
		},
		mongo: {
			username: 'sw-user',
			password: 'sw-password',
			host: '192.168.50.10',
			database: 'sportywide',
		},
	},
	production: {
		postgres: {
			host: 'swrds.c81wigl77r6q.ap-southeast-2.rds.amazonaws.com',
		},
		mongo: {
			host: 'cluster0-e5lls.mongodb.net',
		},
	},
};
