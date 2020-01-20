import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Post {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	text: string;

	@ManyToMany(() => Category)
	@JoinTable()
	categories: Category[];

	@Column({
		default: 0,
	})
	numViews: number;
}
