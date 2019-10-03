require('dotenv').config();
/* eslint-disable */
export const config = {
	default: {
		postgres: {
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			host: 'postgres',
			port: 5432,
			database: process.env.POSTGRES_DATABASE,
		},
	},
	development: {
		mongo_url: 'http://localhost:6000',
	},
};
