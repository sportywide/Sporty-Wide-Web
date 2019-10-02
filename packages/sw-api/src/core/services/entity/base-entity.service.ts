import { DeepPartial, DeleteResult, FindConditions, FindManyOptions, ObjectID, Repository, SaveOptions } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseEntityService<T extends BaseEntity> {
	constructor(private readonly repository: Repository<T>) {}

	getTableName() {
		return this.repository.metadata.tableName;
	}

	public async findAll(): Promise<T[]> {
		return this.repository.find();
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
		return this.repository.create(dto as DeepPartial<any>);
	}

	public merge(entity: T, ...updatedDtos) {
		return this.repository.merge(entity, ...updatedDtos);
	}

	public async findByIds(ids: number[]): Promise<T[]> {
		return this.repository.findByIds(ids);
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
