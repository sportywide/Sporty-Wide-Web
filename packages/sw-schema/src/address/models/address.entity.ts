import { Column, Entity } from 'typeorm';
import { BaseGeneratedEntity } from '@schema/core/base.entity';
import { AddressDto } from '@shared/lib/dtos/address/address.dto';
import { DtoType } from '@shared/lib/dtos/decorators/dto-type.decorator';

@DtoType(AddressDto)
@Entity()
export class Address extends BaseGeneratedEntity {
	@Column({
		name: 'street1',
	})
	street1: string;

	@Column({
		name: 'street2',
	})
	street2: string;

	@Column()
	state: string;

	@Column()
	city: string;

	@Column()
	country: string;

	@Column()
	suburb: string;

	@Column()
	postcode: string;

	@Column()
	lat: number;

	@Column()
	lon: number;
}
