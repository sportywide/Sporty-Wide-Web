import { Sequelize } from 'sequelize-typescript';
import config from '@schema/config';
import { User } from '@schema/user/models/user.entity';

export const databaseProviders = [
	{
		provide: 'SEQUELIZE',
		useFactory: async () => {
			const sequelize = new Sequelize({
				dialect: 'mysql',
				host: config.get('mysql:host'),
				port: config.get('mysql:port'),
				username: config.get('mysql:username'),
				password: config.get('mysql:password'),
				database: config.get('mysql:database'),
			});
			sequelize.addModels([User]);
			await sequelize.sync();
			return sequelize;
		},
	},
];
