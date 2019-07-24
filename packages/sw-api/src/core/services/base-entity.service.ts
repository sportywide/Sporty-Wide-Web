import { Repository, FindConditions, DeleteResult } from 'typeorm';

export class BaseEntityService<T> {
	constructor(private readonly repository: Repository<T>) {}

	public async findAll(): Promise<T[]> {
		return this.repository.find();
	}

	public async findOne(params: FindConditions<T>): Promise<T | undefined> {
		return this.repository.findOne(params);
	}

	public async create(dtos: T[]): Promise<T[]> {
		return this.repository.create(dtos);
	}

	public async save(dto: T) {
		return this.repository.save(dto);
	}

	public async createOne(dto: T): Promise<T> {
		return this.repository.create(dto)[0];
	}

	public async findByIds(ids: number[]): Promise<T[]> {
		return this.repository.findByIds(ids);
	}

	public async findById(id: number): Promise<T | undefined> {
		return this.repository.findOne(id);
	}

	public async delete(params: FindConditions<T>): Promise<DeleteResult> {
		return this.repository.delete(params);
	}
}
