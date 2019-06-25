/* eslint @typescript-eslint/camelcase: 0 */

module.exports = {
	logging: {
		// logstash: {
		// 	host: 'localhost',
		// 	port: 1234,
		// },
		file: {
			max_log_size: 5242880,
			num_backups: 5,
			log_path: 'logs',
			log_file: 'sw.log',
		},
	},
	support_user: {
		email: 'norepy@sportywide.com',
		name: 'Sporty Wide',
	},
};
