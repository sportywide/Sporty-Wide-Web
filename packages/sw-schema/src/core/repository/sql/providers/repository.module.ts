import { DynamicModule, forwardRef } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/typeorm';
import { getSwRepository } from '@schema/core/repository/sql/base.repository';
import { SchemaModule } from '@schema/schema.module';

const tokenMap = new Map<string, Map<Function, symbol>>();

export class SwRepositoryModule {
	static forRoot({
		connection = 'default',
		entities = [],
	}: {
		connection?: string;
		entities: Function[];
	}): DynamicModule {
		registerTokens(connection, entities);

		const providers = getProviders(connection, entities);
		return {
			providers,
			exports: providers,
			module: SwRepositoryModule,
		};
	}
}

function registerTokens(connection, entities: Function[]) {
	let connectionEntityMap = tokenMap.get(connection);
	if (!connectionEntityMap) {
		connectionEntityMap = new Map<Function, symbol>();
		tokenMap.set(connection, connectionEntityMap);
	}
	entities.forEach(entity => {
		connectionEntityMap!.set(entity, Symbol(entity.name));
	});
}

function getProviders(connectionName, entities: Function[] = []) {
	return entities.map(entity => ({
		provide: getSwRepositoryToken(entity, connectionName),
		inject: [getConnectionToken(connectionName)],
		useFactory: connection => getSwRepository(connection, entity),
	}));
}

export function getSwRepositoryToken(entity: Function, connectionName: string) {
	const connectionEntityMap = tokenMap.get(connectionName);
	if (!connectionEntityMap) {
		throw new Error(`Unknown connection ${connectionName}`);
	}
	const token = connectionEntityMap.get(entity);
	if (!token) {
		throw new Error('Entity is not registered');
	}
	return token;
}
