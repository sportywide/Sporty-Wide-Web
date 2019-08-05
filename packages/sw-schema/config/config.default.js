/* eslint @typescript-eslint/camelcase: 0 */

module.exports = {
	mongo_url: 'http://localhost:6000',
	postgres: {
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		host: 'postgres',
		port: 5432,
		database: process.env.POSTGRES_DATABASE,
	},
};
