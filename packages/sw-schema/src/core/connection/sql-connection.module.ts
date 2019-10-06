import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DynamicModule } from '@nestjs/common';
import { SnakeNamingStrategy } from '@schema/core/naming-strategy';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';
import { isDevelopment } from '@shared/lib/utils/env';
import { getMetadataArgsStorage } from 'typeorm';
import { CoreModule } from '@core/core.module';
import { TypeormLoggerService } from '@schema/core/logging/typeorm.logger';
import { noop } from '@shared/lib/utils/functions';

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
					imports: [CoreModule],
				}),
				SwRepositoryModule.forRoot({
					entities: getEntities(),
				}),
			],
			exports: [TypeOrmModule, SwRepositoryModule],
		};
	}

	static forRootAsync(connectionOptions: Partial<TypeOrmModuleAsyncOptions> = {}): DynamicModule {
		return {
			module: SqlConnectionModule,
			imports: [
				TypeOrmModule.forRootAsync({
					inject: [TypeormLoggerService, ...connectionOptions.inject],
					useFactory: (logger, ...args) => {
						const useFactory: any = connectionOptions.useFactory || noop;
						const connectionProperties = useFactory(...args) || {};
						return {
							type: 'postgres',
							entities: getEntities(),
							subscribers: getSubscribers(),
							namingStrategy: new SnakeNamingStrategy(),
							logging: isDevelopment() ? ['query', 'error'] : ['error'],
							logger,
							...connectionProperties,
						};
					},
					imports: [CoreModule, ...connectionOptions.imports],
				}),
				SwRepositoryModule.forRoot({
					entities: getEntities(),
				}),
			],
			exports: [TypeOrmModule, SwRepositoryModule],
		};
	}
}

function getEntities() {
	return getMetadataArgsStorage().tables.map(table => table.target as Function);
}

function getSubscribers() {
	return getMetadataArgsStorage().entitySubscribers.map(subscriber => subscriber.target as Function);
}
