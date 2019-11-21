/* eslint-disable @typescript-eslint/camelcase */
export const config = {
	default: {
		s3: {
			data_bucket_name: 'sw-data-bucket',
		},
		aws: {
			region: 'ap-southeast-2',
			accountId: 409050499179,
		},
	},
	development: {
		s3: {
			url: 'http://localhost:6000',
			accessKeyId: 'S3RVER', // This specific key is required when working offline
			secretAccessKey: 'S3RVER',
		},
		sqs: {
			url: 'http://localhost:9324',
		},
		sns: {
			url: 'http://localhost:4002',
		},
	},
};
