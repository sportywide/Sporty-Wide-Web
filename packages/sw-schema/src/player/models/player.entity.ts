import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';
import { Team } from '@schema/team/models/team.entity';

@Entity()
export class Player extends BaseEntity {
	@Column()
	name: string;

	@Column()
	url: string;

	@Column()
	image: string;

	@Column()
	rating: number;

	@Column()
	age: number;

	@Column('text', { array: true })
	positions: string[];

	@Column()
	teamId: number;

	@ManyToOne(type => Team)
	@JoinColumn({
		name: 'team_id',
	})
	team: Team;

	@Column({
		name: 'team',
	})
	teamName: string;

	@Column()
	nationality: string;

	@Column()
	nationalityId: number;
}
