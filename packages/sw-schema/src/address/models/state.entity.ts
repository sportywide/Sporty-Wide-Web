import { Column, Entity } from 'typeorm';
import { BaseGeneratedEntity } from '@schema/core/base.entity';
import { DtoType } from '@shared/lib/dtos/decorators/dto-type.decorator';
import { StateDto } from '@shared/lib/dtos/address/state.dto';

@DtoType(StateDto)
@Entity({
	name: 'states',
})
export class State extends BaseGeneratedEntity {
	@Column()
	name: string;

	@Column()
	countryId: string;
}
