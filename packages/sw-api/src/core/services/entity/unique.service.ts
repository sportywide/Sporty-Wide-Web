import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class UniqueService {
	private readonly allowUniqueCheck: {};

	constructor(@InjectConnection() private readonly connection: Connection) {
		this.allowUniqueCheck = {
			user: ['email', 'username'],
		};
	}

	async isUnique({ table, field, value }) {
		if (!this.validateUniqueCheck(table, field)) {
			throw new BadRequestException('Invalid table and field');
		}
		const repository = this.connection.getRepository(table);
		return (
			(await repository.count({
				[field]: value,
			})) === 0
		);
	}

	private validateUniqueCheck(table: string, field: string) {
		return this.allowUniqueCheck[table] && this.allowUniqueCheck[table].includes(field);
	}
}
