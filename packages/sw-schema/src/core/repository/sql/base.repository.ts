import {
	Connection,
	DeleteQueryBuilder,
	EntitySchema,
	EntitySubscriberInterface,
	FindConditions,
	ObjectID,
	ObjectType,
	QueryBuilder,
	QueryRunner,
	Repository,
	UpdateQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { SwSubscriber } from '@schema/core/subscriber/sql/base.subscriber';
import { wrap } from '@shared/lib/utils/object/proxy';
import { BaseEntity } from '@schema/core/base.entity';

class SwBaseRepository<T> {
	constructor(private repository: Repository<T>) {}

	async increment(conditions: FindConditions<T>, propertyPath: string, value: number | string) {
		const updateResult = await this.repository.increment(conditions, propertyPath, value);
		const updatedEntityIds = await this.advancedFindIds(conditions);
		notifyUpdate(this.repository, updatedEntityIds);
		return updateResult;
	}

	async decrement(conditions: FindConditions<T>, propertyPath: string, value: number | string) {
		const updateResult = await this.repository.decrement(conditions, propertyPath, value);
		const updatedEntityIds = await this.advancedFindIds(conditions);
		notifyUpdate(this.repository, updatedEntityIds);
		return updateResult;
	}

	async update(
		conditions: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<T>,
		partialObject: QueryDeepPartialEntity<T>
	) {
		const updatedEntityIds = await this.advancedFindIds(conditions);
		const updateResult = await this.repository.update(conditions, partialObject);
		if (updatedEntityIds.length) {
			notifyUpdate(this.repository, updatedEntityIds);
		}
		return updateResult;
	}

	async save(...args) {
		// @ts-ignore
		const result = await this.repository.save(...args);
		let entities = result;
		if (!Array.isArray(entities)) {
			entities = [entities];
		}
		entities.forEach(entity => {
			if (entity instanceof BaseEntity) {
				entity.afterLoad();
			}
		});
		return result;
	}

	async delete(
		conditions: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<T>
	) {
		const deletingEntities = await this.advancedFind(conditions);
		const deleteResult = await this.repository.delete(conditions);
		if (deletingEntities.length) {
			notifyRemove(this.repository, deletingEntities);
		}
		return deleteResult;
	}

	createQueryBuilder(alias?: string, queryRunner?: QueryRunner) {
		return SwQueryBuilder.from(
			this.repository.createQueryBuilder(alias, queryRunner),
			this.repository.metadata.target
		);
	}

	advancedFind(
		criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<T>
	) {
		if (
			typeof criteria === 'string' ||
			typeof criteria === 'number' ||
			criteria instanceof Date ||
			criteria instanceof Array
		) {
			return this.repository
				.createQueryBuilder()
				.whereInIds(criteria)
				.getMany();
		} else {
			return this.repository
				.createQueryBuilder()
				.where(criteria)
				.getMany();
		}
	}

	async advancedFindIds(
		criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<T>
	) {
		let rows: any[] = [];
		if (
			typeof criteria === 'string' ||
			typeof criteria === 'number' ||
			criteria instanceof Date ||
			criteria instanceof Array
		) {
			rows = await this.repository
				.createQueryBuilder()
				.whereInIds(criteria)
				.addSelect('id', 'id')
				.getRawMany();
		} else {
			rows = await this.repository
				.createQueryBuilder()
				.where(criteria)
				.addSelect('id', 'id')
				.getRawMany();
		}

		return rows.map(({ id }) => id);
	}
}

//hack to prevent export not found warning when babel typescript strips out type information
export const SwRepository = {};
export type SwRepository<T> = Repository<T> & SwBaseRepository<T>;

class SwQueryBuilder<T> {
	constructor(private queryBuilder: QueryBuilder<T>, private objectType: ObjectType<T> | EntitySchema<T> | string) {}

	static from<T>(queryBuilder: QueryBuilder<T>, objectType) {
		const customQueryBuilder = new SwQueryBuilder(queryBuilder, objectType);
		return wrap(customQueryBuilder, queryBuilder) as SwRepository<T>;
	}

	select() {
		return SwQueryBuilder.from<T>(this.queryBuilder.select(), this.objectType);
	}

	update() {
		return SwQueryBuilder.from<T>(this.queryBuilder.update(), this.objectType);
	}

	delete() {
		return SwQueryBuilder.from<T>(this.queryBuilder.delete(), this.objectType);
	}

	async execute() {
		let entityIds: any[] = [];

		if (this.queryBuilder instanceof UpdateQueryBuilder || this.queryBuilder instanceof DeleteQueryBuilder) {
			try {
				const selectQuery = this.queryBuilder.select(
					this.queryBuilder.alias ? `${this.queryBuilder.alias}.id` : 'id',
					'id'
				);
				selectQuery.expressionMap.nativeParameters = {};
				entityIds = (await selectQuery.getRawMany()).map(({ id }) => id);
			} catch (e) {
				console.error(e);
			}
		}

		const result = await this.queryBuilder.execute();

		if (entityIds.length) {
			if (this.queryBuilder instanceof UpdateQueryBuilder) {
				notifyUpdate(this.queryBuilder.connection.getRepository(this.objectType), entityIds);
			} else if (this.queryBuilder instanceof DeleteQueryBuilder) {
				notifyRemove(this.queryBuilder.connection.getRepository(this.objectType), entityIds);
			}
		}

		return result;
	}
}

export function getSwRepository<T>(connection: Connection, objectType: ObjectType<T>): SwRepository<T> {
	const repository = connection.getRepository<T>(objectType);
	const customRepository = new SwBaseRepository<T>(repository);
	return wrap(customRepository, repository) as SwRepository<T>;
}

function notifyUpdate(repository, entityIds) {
	repository.manager.connection.subscribers.forEach(subscriber => {
		if (!((subscriber as EntitySubscriberInterface) instanceof SwSubscriber)) {
			return;
		}
		subscriber.afterUpdateEntities({
			tableName: repository.metadata.tableName,
			ids: entityIds,
		});
	});
}

function notifyRemove(repository, entityIds) {
	repository.manager.connection.subscribers.forEach(subscriber => {
		if (!((subscriber as EntitySubscriberInterface) instanceof SwSubscriber)) {
			return;
		}
		subscriber.afterRemoveEntities({
			tableName: repository.metadata.tableName,
			ids: entityIds,
		});
	});
}
