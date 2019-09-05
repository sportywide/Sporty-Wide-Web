import { Controller, Get, Param, Query } from '@nestjs/common';
import { UniqueService } from '@api/core/services/entity/unique.service';

@Controller('/util')
export class UtilController {
	constructor(private readonly uniqueService: UniqueService) {}

	@Get('/unique/:table/:field')
	public async checkUnique(
		@Param('table') table: string,
		@Param('field') field: string,
		@Query('value') value: string
	): Promise<boolean> {
		return this.uniqueService.isUnique({ value, field, table });
	}
}
