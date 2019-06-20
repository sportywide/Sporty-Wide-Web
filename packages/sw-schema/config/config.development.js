/* eslint @typescript-eslint/camelcase: 0 */

module.exports = {
	mongo_url: 'http://localhost:6000',
	mysql: {
		username: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		host: 'mysql',
		port: 3306,
		database: process.env.MYSQL_DATABASE,
	},
};
