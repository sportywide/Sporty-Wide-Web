/* eslint-disable @typescript-eslint/camelcase */
const findup = require('find-up');
require('dotenv').config({
	path: findup.sync('.env'),
});

export const config = {
	default: {
		postgres: {
			username: process.env.SW_POSTGRES_USER,
			password: process.env.SW_POSTGRES_PASSWORD,
			database: process.env.SW_POSTGRES_DB,
		},
	},
};
