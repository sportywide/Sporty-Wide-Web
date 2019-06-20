import { Sequelize } from 'sequelize-typescript';
import { User } from '@schema/user/models/user.entity';
import { SCHEMA_CONFIG } from '@schema/core/config/config.constant';

export const databaseProviders = [
	{
		provide: 'SEQUELIZE',
		useFactory: async schemaConfig => {
			const sequelize = new Sequelize({
				dialect: 'mysql',
				host: schemaConfig.get('mysql:host'),
				port: schemaConfig.get('mysql:port'),
				username: schemaConfig.get('mysql:username'),
				password: schemaConfig.get('mysql:password'),
				database: schemaConfig.get('mysql:database'),
			});
			sequelize.addModels([User]);
			await sequelize.sync();
			return sequelize;
		},
		inject: [SCHEMA_CONFIG],
	},
];
