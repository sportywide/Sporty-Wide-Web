import { Column, Entity, AfterLoad } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';
import { TeamDto } from '@shared/lib/dtos/team/team.dto';
import { DtoType } from '@shared/lib/dtos/decorators/dto-type.decorator';

@DtoType(TeamDto)
@Entity()
export class Team extends BaseEntity {
	@Column()
	name: string;

	@Column()
	title: string;

	@Column()
	image: string;

	@Column()
	att: number;

	@Column()
	mid: number;

	@Column()
	def: number;

	@Column()
	ovr: number;

	@Column()
	rating: string;

	@Column()
	league: string;

	@Column()
	leagueId: number;

	@Column('text', { array: true })
	alias: string[];

	@AfterLoad()
	addAlias() {
		this.alias = this.alias || [];
		this.alias.push(
			this.title
				.split(/\s+/)
				.reverse()
				.join(' ')
		);
	}
}
