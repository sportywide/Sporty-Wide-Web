require('dotenv').config();
/* eslint-disable */
export const config = {
	default: {
		port: 3000,
		server_url: 'http://api:5000',
	},
	development: {
		cookie_secret: 'testsecret',
		a: process.env.A,
	},
};
