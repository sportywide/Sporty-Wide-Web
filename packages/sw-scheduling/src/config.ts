/* eslint-disable @typescript-eslint/camelcase */
export const config = {
	default: {
		s3: {
			data_bucket_name: 'sw-data-bucket',
		},
	},
	development: {
		s3: {
			url: 'http://localhost:6000',
			accessKeyId: 'S3RVER', // This specific key is required when working offline
			secretAccessKey: 'S3RVER',
		},
	},
};
