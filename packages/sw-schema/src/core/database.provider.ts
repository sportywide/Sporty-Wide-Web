import { Sequelize } from 'sequelize-typescript';
import config from '@schema/config';

export const databaseProviders = [
	{
		provide: 'SEQUELIZE',
		useFactory: async () => {
			return new Sequelize({
				dialect: 'mysql',
				host: config.get('mysql:host'),
				port: config.get('mysql:port'),
				username: config.get('mysql:username'),
				password: config.get('mysql:password'),
				database: config.get('mysql:database'),
			});
		},
	},
];
