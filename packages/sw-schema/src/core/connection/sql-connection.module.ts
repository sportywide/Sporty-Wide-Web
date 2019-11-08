import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DynamicModule } from '@nestjs/common';
import { SnakeNamingStrategy } from '@schema/core/naming-strategy';
import { ConnectionManager, getConnectionManager, getMetadataArgsStorage, ConnectionOptions } from 'typeorm';
import { isDevelopment } from '@shared/lib/utils/env';

import { TypeormLoggerService } from '@schema/core/logging/typeorm.logger';
import { noop } from '@shared/lib/utils/functions';
import { CoreSchemaModule } from '@schema/core/core-schema.module';

export class SqlConnectionModule {
	static forRoot(connectionOptions: Partial<TypeOrmModuleAsyncOptions> = {}): DynamicModule {
		return {
			module: SqlConnectionModule,
			imports: [
				TypeOrmModule.forRootAsync({
					inject: [TypeormLoggerService],
					useFactory: logger => ({
						type: 'postgres',
						entities: getEntities(),
						subscribers: getSubscribers(),
						namingStrategy: new SnakeNamingStrategy(),
						logging: isDevelopment() ? ['query', 'error'] : ['error'],
						logger,
						...connectionOptions,
					}),
					imports: [CoreSchemaModule],
				}),
			],
			exports: [TypeOrmModule],
		};
	}

	static forRootAsync(connectionOptions: Partial<TypeOrmModuleAsyncOptions> = {}): DynamicModule {
		return {
			module: SqlConnectionModule,
			imports: [
				TypeOrmModule.forRootAsync({
					inject: [TypeormLoggerService, ...connectionOptions.inject],
					useFactory: async (logger, ...args) => {
						const connectionManager: ConnectionManager = getConnectionManager();
						let options: ConnectionOptions;
						if (connectionManager.has('default')) {
							options = connectionManager.get('default').options;
							const connection = await connectionManager.get('default');
							try {
								if (connection.isConnected) {
									await connectionManager.get('default').close();
								}
							} catch (e) {}
						} else {
							const useFactory: any = connectionOptions.useFactory || noop;
							// eslint-disable-next-line react-hooks/rules-of-hooks
							const connectionProperties = (await useFactory(...args)) || {};
							options = {
								type: 'postgres',
								entities: getEntities(),
								subscribers: getSubscribers(),
								namingStrategy: new SnakeNamingStrategy(),
								logging: isDevelopment() ? ['query', 'error'] : ['error'],
								logger,
								...connectionProperties,
							};
						}
						return options;
					},
					imports: [CoreSchemaModule, ...connectionOptions.imports],
				}),
			],
			exports: [TypeOrmModule],
		};
	}
}

function getEntities() {
	return getMetadataArgsStorage().tables.map(table => table.target as Function);
}

function getSubscribers() {
	return getMetadataArgsStorage().entitySubscribers.map(subscriber => subscriber.target as Function);
}
