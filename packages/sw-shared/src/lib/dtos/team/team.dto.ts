import { Expose } from 'class-transformer-imp';

export class TeamDto {
	@Expose()
	id: number;
	@Expose()
	name: string;
	@Expose()
	image: string;
}
