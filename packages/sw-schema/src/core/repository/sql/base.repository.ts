/* eslint-disable prettier/prettier */
import {
	Connection,
	DeepPartial,
	DeleteQueryBuilder,
	EntitySchema,
	EntitySubscriberInterface,
	FindConditions,
	InsertQueryBuilder,
	ObjectID,
	ObjectType,
	QueryBuilder,
	QueryRunner,
	Repository,
	SelectQueryBuilder,
	UpdateQueryBuilder,
	FindManyOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { SwSubscriber } from '@schema/core/subscriber/sql/base.subscriber';
import { wrap } from '@shared/lib/utils/object/proxy';
import { keyBy } from 'lodash';
import { BaseGeneratedEntity } from '@schema/core/base.entity';

class SwBaseRepository<T> {
	constructor(private repository: Repository<T>) {}

	async increment(conditions: FindConditions<T>, propertyPath: string, value: number | string) {
		const updatedEntityIds = await this.advancedFindIds(conditions);
		let updateResult;
		if (updatedEntityIds.length) {
			updateResult = await this.repository.increment(conditions, propertyPath, value);
			notifyUpdate(this.repository, updatedEntityIds);
		}
		return updateResult;
	}

	async decrement(conditions: FindConditions<T>, propertyPath: string, value: number | string) {
		const updatedEntityIds = await this.advancedFindIds(conditions);
		let updateResult;
		if (updatedEntityIds.length) {
			updateResult = await this.repository.decrement(conditions, propertyPath, value);
			notifyUpdate(this.repository, updatedEntityIds);
		}
		return updateResult;
	}

	async update(
		conditions: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<T>,
		partialObject: QueryDeepPartialEntity<T>,
		{ shouldNotifyUpdate = true } = {}
	) {
		if (shouldNotifyUpdate) {
			const updatedEntityIds = await this.advancedFindIds(conditions);
			let updateResult;
			if (updatedEntityIds.length) {
				updateResult = await this.repository.update(conditions, partialObject);
				notifyUpdate(this.repository, updatedEntityIds);
			}
			return updateResult;
		} else {
			return this.repository.update(conditions, partialObject);
		}
	}

	getTableName() {
		return this.repository.metadata.tableName;
	}

	getTableNameForEntity(entity) {
		return this.repository.metadata.connection.getMetadata(entity).tableName;
	}

	async upsert({
		object,
		upsertColumns,
		conflictColumns = ['id'],
	}: {
		object;
		upsertColumns?: string[];
		conflictColumns?: string[];
	}): Promise<T> {
		const keys: string[] = Object.keys(object).filter(k => this.getDatabaseColumnName(k));
		const setterString = keys
			.map(k => {
				if (upsertColumns && !upsertColumns.includes(k)) {
					return;
				}
				const databaseName = this.getDatabaseColumnName(k);
				if (!databaseName) {
					return;
				}
				return `${databaseName} = :${k}`;
			})
			.filter(str => str)
			.join(',');
		const queryBuilder = this.repository.createQueryBuilder();

		const conflictColumnStr = conflictColumns.map(column => `"${this.getDatabaseColumnName(column)}"`).join(',');

		const qb = queryBuilder
			.insert()
			.into(this.repository.metadata.tableName)
			.values(object)
			.onConflict(`(${conflictColumnStr}) DO UPDATE SET ${setterString}`);

		keys.forEach(k => {
			qb.setParameter(k, (object as any)[k]);
		});

		return (await qb.returning('*').execute()).generatedMaps[0] as T;
	}

	getDatabaseColumnName(key) {
		const columnMetadata = this.repository.metadata.findColumnWithPropertyName(key);
		return columnMetadata ? columnMetadata.databaseName : null;
	}

	async save(...args) {
		// @ts-ignore
		const result = await this.repository.save(...args);
		let entities = result;
		if (!Array.isArray(entities)) {
			entities = [entities];
		}
		entities.forEach(entity => {
			if (entity instanceof BaseGeneratedEntity) {
				entity.afterLoad();
			}
		});
		return result;
	}

	async delete(
		conditions: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<T>
	) {
		const deletingEntities = await this.advancedFindIds(conditions);
		let deleteResult;
		if (deletingEntities.length) {
			deleteResult = await this.repository.delete(conditions);
			notifyRemove(this.repository, deletingEntities);
		}
		return deleteResult;
	}

	createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SwSelectQueryBuilder<T> {
		return SwQueryBaseBuilder.from(
			this.repository.createQueryBuilder(alias, queryRunner),
			this.repository.metadata.target
		) as SwSelectQueryBuilder<T>;
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

	public createOneEntity(dto: any): T {
		return this.repository.create(dto as DeepPartial<any>);
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

	async advancedFindSelect(
		selectColumns = [],
		criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<T>
	) {
		let queryBuilder: SelectQueryBuilder<T>;
		if (
			typeof criteria === 'string' ||
			typeof criteria === 'number' ||
			criteria instanceof Date ||
			criteria instanceof Array
		) {
			queryBuilder = await this.repository.createQueryBuilder().whereInIds(criteria);
		} else {
			queryBuilder = await this.repository.createQueryBuilder().where(criteria);
		}

		selectColumns.forEach(column => {
			queryBuilder.addSelect(column);
		});

		return queryBuilder.getRawMany();
	}

	async getByIdsOrdered(ids: number[], includes: string[] = []) {
		const tableName = this.getTableName();
		let queryBuilder = this.createQueryBuilder(tableName);
		queryBuilder.where(`${tableName}.id IN (:...ids)`, { ids });
		queryBuilder.orderBy(`field(${tableName}.id, ARRAY[${ids.join(',')}])`);

		includes.forEach(include => {
			queryBuilder = queryBuilder.leftJoinAndSelect(`${tableName}.${include}`, include);
		});
		return queryBuilder.getMany();
	}

	async getMappedByIds(ids: number[], options?: FindManyOptions): Promise<Record<number, T>> {
		ids = ids.filter(id => id);
		const entities = await this.repository.findByIds(ids, options);
		return keyBy(entities, 'id');
	}
}

//hack to prevent export not found warning when babel typescript strips out type information
export const SwRepository = {};
export type SwRepository<T> = SwBaseRepository<T> & Repository<T>;

export type SwQueryBuilder<T> = SwQueryBaseBuilder<T> & QueryBuilder<T>;
export type SwSelectQueryBuilder<T> = SwQueryBaseBuilder<T> & SelectQueryBuilder<T>;
export type SwUpdateQueryBuilder<T> = SwQueryBaseBuilder<T> & UpdateQueryBuilder<T>;
export type SwDeleteQueryBuilder<T> = SwQueryBaseBuilder<T> & DeleteQueryBuilder<T>;
export type SwInsertQueryBuilder<T> = SwQueryBaseBuilder<T> & InsertQueryBuilder<T>;

class SwQueryBaseBuilder<T> {
	constructor(private queryBuilder: QueryBuilder<T>, private objectType: ObjectType<T> | EntitySchema<T> | string) {}

	static from<T>(queryBuilder: QueryBuilder<T>, objectType) {
		const customQueryBuilder = new SwQueryBaseBuilder(queryBuilder, objectType);
		return wrap(customQueryBuilder, queryBuilder) as SwQueryBuilder<T>;
	}

	select(): SwSelectQueryBuilder<T>;
	select(selection?: string[]): SwSelectQueryBuilder<T>;
	select(selection?: string | string[], selectionAliasName?: string): SwSelectQueryBuilder<T> {
		return SwQueryBaseBuilder.from<T>(
			this.queryBuilder.select(selection as any, selectionAliasName),
			this.objectType
		) as SwSelectQueryBuilder<T>;
	}

	update() {
		return SwQueryBaseBuilder.from<T>(this.queryBuilder.update(), this.objectType) as SwUpdateQueryBuilder<T>;
	}

	delete() {
		return SwQueryBaseBuilder.from<T>(this.queryBuilder.delete(), this.objectType) as SwDeleteQueryBuilder<T>;
	}

	insert() {
		return SwQueryBaseBuilder.from<T>(this.queryBuilder.insert(), this.objectType) as SwInsertQueryBuilder<T>;
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
				console.error(__filename, e);
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
