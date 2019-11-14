require('dotenv').config();
/* eslint-disable */
export const config = {
	default: {
		postgres: {
			username: process.env.SW_POSTGRES_USER,
			password: process.env.SW_POSTGRES_PASSWORD,
			host: 'postgres',
			port: 5432,
			database: process.env.SW_POSTGRES_DB,
		},
		mongo: {
			username: process.env.SW_MONGO_USER,
			password: process.env.SW_MONGO_PASSWORD,
			host: 'mongo',
			port: 27017,
			database: process.env.SW_MONGO_DB,
		}
	},
	test: {
		postgres: {
			host: 'localhost',
		},
		mongo_url: 'http://localhost:6000',
	},
};
