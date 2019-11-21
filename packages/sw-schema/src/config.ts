require('dotenv').config();
/* eslint-disable */
export const config = {
	default: {
		postgres: {
			username: process.env.SW_POSTGRES_USER,
			password: process.env.SW_POSTGRES_PASSWORD,
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
			username: 'sw-user',
			password: 'sw-password',
			host: '192.168.50.10',
			database: 'sportywide',
		},
		mongo: {
			username: 'sw-user',
			password: 'sw-password',
			host: '192.168.50.10',
			database: 'sportywide',
		},
	},
	test: {
		postgres: {
			username: 'sw-user',
			password: 'sw-password',
			host: '192.168.50.10',
			database: 'sportywide',
		},
		mongo: {
			username: 'sw-user',
			password: 'sw-password',
			host: '192.168.50.10',
			database: 'sportywide',
		},
	},
};
