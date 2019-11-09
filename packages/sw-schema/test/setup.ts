import path from 'path';
import { createConnection } from 'typeorm';
import { Post } from '@schema-test/entities/post.entity';
import { Category } from '@schema-test/entities/category.entity';
import { Test } from '@nestjs/testing';
import { SqlConnectionModule } from '@schema/core/connection/sql-connection.module';
import { SCHEMA_CONFIG } from '@core/config/config.constants';
import { ConfigModule } from '@core/config/config.module';
import { config } from '@schema/config';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';
import { TypeormLoggerService } from '@schema/core/logging/typeorm.logger';
import { createSpyObj } from 'jest-createspyobj';

export async function setupMemoryConnection() {
	const connection = await createConnection({
		type: 'sqlite',
		name: 'memory',
		database: ':memory:',
		entities: [Post, Category],
		migrations: [path.resolve(__dirname, './migrations/**/*.migration.ts')],
		synchronize: true,
		logging: false,
	});
	await connection.runMigrations();
	return connection;
}

export function setupDatabaseModule({ entities, modules = [], ...options }) {
	return Test.createTestingModule({
		imports: [
			ConfigModule.forRoot({
				config,
				exportAs: SCHEMA_CONFIG,
			}),
			SqlConnectionModule.forRootAsync({
				inject: [SCHEMA_CONFIG],
				useFactory: schemaConfig => ({
					type: 'postgres',
					host: schemaConfig.get('postgres:host'),
					port: schemaConfig.get('postgres:port'),
					username: schemaConfig.get('postgres:username'),
					password: schemaConfig.get('postgres:password'),
					database: schemaConfig.get('postgres:database'),
					entities,
					subscribers: [],
				}),
				imports: [ConfigModule],
			}),
			SwRepositoryModule.forFeature({
				entities,
			}),
			...modules,
		],
		...options,
	})
		.overrideProvider(TypeormLoggerService)
		.useValue({
			...createSpyObj(TypeormLoggerService),
			logQueryError: console.error,
		});
}
