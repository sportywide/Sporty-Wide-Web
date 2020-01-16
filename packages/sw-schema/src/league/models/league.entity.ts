import { BaseGeneratedEntity } from '@schema/core/base.entity';
import { Column, Entity } from 'typeorm';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { DtoType } from '@shared/lib/dtos/decorators/dto-type.decorator';

@DtoType(LeagueDto)
@Entity()
export class League extends BaseGeneratedEntity {
	@Column()
	name: string;

	@Column()
	title: string;

	@Column()
	image: string;
}
