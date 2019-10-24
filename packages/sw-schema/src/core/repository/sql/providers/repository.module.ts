import { DynamicModule } from '@nestjs/common';
import { getConnectionToken, TypeOrmModule } from '@nestjs/typeorm';
import { getSwRepository } from '@schema/core/repository/sql/base.repository';

export class SwRepositoryModule {
	static forFeature({
		connection = 'default',
		entities = [],
	}: {
		connection?: string;
		entities: Function[];
	}): DynamicModule {
		const providers = getProviders(connection, entities);
		return {
			imports: [TypeOrmModule.forFeature(entities, connection)],
			providers,
			exports: providers,
			module: SwRepositoryModule,
		};
	}
}

function getProviders(connectionName?, entities: Function[] = []) {
	return entities.map(entity => ({
		provide: getSwRepositoryToken(entity, connectionName),
		inject: [getConnectionToken(connectionName)],
		useFactory: connection => getSwRepository(connection, entity),
	}));
}

export function getSwRepositoryToken(entity: Function, connectionName = 'default') {
	return `sw-repository-${connectionName}-${entity.name}`;
}
