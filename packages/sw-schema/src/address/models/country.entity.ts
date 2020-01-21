import { Column, Entity } from 'typeorm';
import { BaseGeneratedEntity } from '@schema/core/base.entity';
import { DtoType } from '@shared/lib/dtos/decorators/dto-type.decorator';
import { CountryDto } from '@shared/lib/dtos/address/country.dto';

@DtoType(CountryDto)
@Entity({
	name: 'countries',
})
export class Country extends BaseGeneratedEntity {
	@Column()
	sortname: string;

	@Column()
	name: string;

	@Column()
	phonecode: number;
}
