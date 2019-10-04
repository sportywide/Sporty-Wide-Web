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
	},
};
