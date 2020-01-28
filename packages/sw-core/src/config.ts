require('@shared/lib/utils/env/dotenv').default.config();
/* eslint-disable */
export const config = {
	default: {
		aws: {
			region: 'ap-southeast-2',
			accountId: 409050499179,
		},
		redis: {
			host: '192.168.50.10',
			port: 6379,
		},
	},
	development: {
		s3: {
			url: 'http://192.168.50.10:9000',
			accessKeyId: 'minio',
			secretAccessKey: 'minio123',
		},
		sqs: {
			url: 'http://192.168.50.10:9324',
		},
		sns: {
			url: 'http://localhost:4002',
		},
		logging: {
			default: 'DEBUG',
			file: {
				max_log_size: 5242880,
				num_backups: 5,
				log_path: 'logs',
				log_file: 'sw.log',
			},
		},
		support_user: {
			email: 'support@mg.sportywide.com',
			name: 'Sporty Wide',
		},
	},
	test: {
		logging: {
			default: 'INFO',
		},
	},
	production: {
		redis: {
			host: 'sw-redis-cluster.mkvqjz.0001.apse2.cache.amazonaws.com',
			port: 6379,
		},
		logging: {
			default: 'INFO',
			logz: {
				token: process.env.SW_LOGZ_TOKEN,
			},
		},
		support_user: {
			email: 'support@mg.sportywide.com',
			name: 'Sporty Wide',
		},
	},
};
