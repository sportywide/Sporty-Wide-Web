import { Column, Entity } from 'typeorm';
import { BaseGeneratedEntity } from '@schema/core/base.entity';
import { DtoType } from '@shared/lib/dtos/decorators/dto-type.decorator';
import { CityDto } from '@shared/lib/dtos/address/city.dto';

@DtoType(CityDto)
@Entity({
	name: 'cities',
})
export class City extends BaseGeneratedEntity {
	@Column()
	name: string;

	@Column()
	stateId: string;
}
