import { DeepPartial, DeleteResult, FindConditions, FindManyOptions, In, ObjectID, SaveOptions } from 'typeorm';
import { BaseGeneratedEntity } from '@schema/core/base.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { SwLRUCache } from '@shared/lib/utils/cache/lru-cache';
import DataLoader from 'dataloader';
import { keyBy, omit } from 'lodash';
import { SwRepository } from '@schema/core/repository/sql/base.repository';

export class BaseEntityService<T extends BaseGeneratedEntity> {
	private cache: SwLRUCache<DataLoader<number, T>>;
	constructor(private readonly repository: SwRepository<T>) {
		this.cache = new SwLRUCache();
	}

	getTableName() {
		return this.repository.metadata.tableName;
	}

	public async findAll(): Promise<T[]> {
		return this.repository.find();
	}

	find(conditions: FindManyOptions<T>) {
		return this.repository.find(conditions);
	}

	public async findIdsByDataLoader({
		ids = [],
		options = { property: 'id' },
	}: {
		ids: number[];
		options?: FindManyOptions<T> & { property: keyof T };
	}) {
		const cacheEntry = this.cache.get(options);
		let dataLoader: DataLoader<number, T>;
		if (cacheEntry) {
			dataLoader = cacheEntry.item;
		} else {
			dataLoader = new DataLoader<number, T>(
				async ids => {
					const entities = await this.find({
						where: {
							[options.property]: In(ids),
						},
						...omit(options, ['property']),
					});
					const entityMap = keyBy(entities, options.property);
					return ids.map(id => entityMap[id]);
				},
				{ cache: false }
			);
			this.cache.put(options, dataLoader);
		}

		return dataLoader.loadMany(ids);
	}

	public async findIdByDataLoader({
		id,
		options,
	}: {
		id: number;
		options?: FindManyOptions<T> & { property: keyof T };
	}) {
		return (await this.findIdsByDataLoader({
			ids: [id],
			options,
		}))[0];
	}

	public async findOne(params: FindConditions<T>): Promise<T | undefined> {
		return this.repository.findOne(params);
	}

	public createEntity(dtos: DeepPartial<T>[]): T[] {
		return this.repository.create(dtos);
	}

	public async saveOne(dto: DeepPartial<T>, saveOptions?: SaveOptions): Promise<T> {
		return this.repository.save(dto, saveOptions);
	}

	public async update(
		criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<T>,
		dto: QueryDeepPartialEntity<T>
	) {
		return this.repository.update(criteria, dto);
	}

	public async insertOne(dto: QueryDeepPartialEntity<T>) {
		return this.repository.insert(dto);
	}

	public async insert(dto: QueryDeepPartialEntity<T>[]) {
		return this.repository.insert(dto);
	}

	public async save(dto: DeepPartial<T>[]) {
		return this.repository.save(dto);
	}

	public async count(findOptions: FindManyOptions<T> | undefined) {
		return this.repository.count(findOptions);
	}

	public createOneEntity(dto: any): T {
		return this.repository.createOneEntity(dto as DeepPartial<any>);
	}

	public merge(entity: T, ...updatedDtos) {
		return this.repository.merge(entity, ...updatedDtos);
	}

	public async findByIds(ids: number[], options: FindManyOptions<T> = {}): Promise<T[]> {
		return this.repository.findByIds(ids, options);
	}

	public async findById({
		id,
		cache,
		relations,
	}: {
		id: number;
		cache?: boolean;
		relations?: string[];
	}): Promise<T | undefined> {
		return this.repository.findOne({
			where: {
				id,
			},
			relations,
			cache,
		});
	}

	public async delete(params: FindConditions<T>): Promise<DeleteResult> {
		return this.repository.delete(params);
	}

	public async remove(entity: T): Promise<T> {
		return this.repository.remove(entity);
	}

	public isResolved(entity: T, key) {
		return entity.isResolved(key);
	}
}
