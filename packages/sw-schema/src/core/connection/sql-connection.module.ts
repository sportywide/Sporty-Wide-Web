import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DynamicModule } from '@nestjs/common';
import { SnakeNamingStrategy } from '@schema/core/naming-strategy';
import { ConnectionManager, getConnectionManager, getMetadataArgsStorage, ConnectionOptions } from 'typeorm';
import { isDevelopment } from '@shared/lib/utils/env';

import { TypeormLoggerService } from '@schema/core/logging/typeorm.logger';
import { noop } from '@shared/lib/utils/functions';
import { CoreSchemaModule } from '@schema/core/core-schema.module';

export class SqlConnectionModule {
	static forRoot(
		connectionOptions: Partial<TypeOrmModuleAsyncOptions & { keepConnectionAlive?: boolean }> = {}
	): DynamicModule {
		return {
			module: SqlConnectionModule,
			imports: [
				TypeOrmModule.forRootAsync({
					inject: [TypeormLoggerService],
					useFactory: async logger => {
						let options: any;
						if (!connectionOptions.keepConnectionAlive) {
							options = await maybeExistingCloseConnection(logger);
						}
						if (!options) {
							options = {
								keepConnectionAlive: connectionOptions.keepConnectionAlive,
								type: 'postgres',
								entities: getEntities(),
								subscribers: getSubscribers(),
								namingStrategy: new SnakeNamingStrategy(),
								logging: isDevelopment() ? ['query', 'error'] : ['error'],
								logger,
								...connectionOptions,
							};
						}
						return options;
					},
					imports: [CoreSchemaModule],
				}),
			],
			exports: [TypeOrmModule],
		};
	}

	static forRootAsync(
		connectionInitOptions: Partial<TypeOrmModuleAsyncOptions & { keepConnectionAlive?: boolean }> = {}
	): DynamicModule {
		return {
			module: SqlConnectionModule,
			imports: [
				TypeOrmModule.forRootAsync({
					inject: [TypeormLoggerService, ...connectionInitOptions.inject],
					useFactory: async (logger, ...args) => {
						let options: ConnectionOptions = null;
						if (!connectionInitOptions.keepConnectionAlive) {
							options = await maybeExistingCloseConnection(logger);
						}

						if (!options) {
							const useFactory: any = connectionInitOptions.useFactory || noop;
							// eslint-disable-next-line react-hooks/rules-of-hooks
							const connectionProperties = (await useFactory(...args)) || {};
							options = {
								keepConnectionAlive: connectionInitOptions.keepConnectionAlive,
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
					imports: [CoreSchemaModule, ...connectionInitOptions.imports],
				}),
			],
			exports: [TypeOrmModule],
		};
	}
}

async function maybeExistingCloseConnection(logger): Promise<ConnectionOptions | null> {
	const connectionManager: ConnectionManager = getConnectionManager();
	if (!connectionManager.has('default')) {
		return null;
	}
	const options = connectionManager.get('default').options;
	const connection = await connectionManager.get('default');
	try {
		if (connection.isConnected) {
			logger.error('Closing existing connection');
			await connectionManager.get('default').close();
		}
	} catch (e) {
		logger.error('Failed to close existing connection');
	}
	return options;
}

function getEntities() {
	return getMetadataArgsStorage().tables.map(table => table.target as Function);
}

function getSubscribers() {
	return getMetadataArgsStorage().entitySubscribers.map(subscriber => subscriber.target as Function);
}
