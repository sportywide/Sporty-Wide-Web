import { IFindOptions, Model } from 'sequelize-typescript';

export class BaseEntityService<T extends Model<T>> {
	constructor(private readonly repository) {}

	public async findAll(): Promise<T[]> {
		return this.repository.findAll();
	}

	public async findOne(params: IFindOptions<T>): Promise<T | null> {
		return this.repository.findOne(params);
	}

	public async create(dto): Promise<T> {
		const entity = await this.repository.create(dto);
		entity.set('id', entity.get('id') || entity.id);
		return entity;
	}

	public async findById(id: number): Promise<T> {
		return this.repository.findByPk(id);
	}

	public async delete(params: IFindOptions<T>): Promise<any> {
		const instance = await this.repository.findOne(params);
		if (!instance) {
			return;
		}
		return instance.destroy();
	}
}
