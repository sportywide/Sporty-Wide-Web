import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Player {
	@PrimaryColumn()
	id: number;

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

	@Column()
	positions: string;

	@Column()
	teamId: number;

	@Column()
	team: string;

	@Column()
	nationality: string;

	@Column()
	nationalityId: number;
}
