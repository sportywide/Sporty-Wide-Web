require('dotenv').config();
/* eslint-disable */
export const config = {
	default: {
		redis: {
			host: 'redis',
			port: 6379,
		},
	},
	development: {
		logging: {
			// logstash: {
			// 	host: 'localhost',
			// 	port: 1234,
			// },
			default: 'DEBUG',
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
	},
	test: {
		logging: {
			default: 'INFO',
		},
	},
	production: {
		logging: {
			default: 'INFO',
		},
	},
};
