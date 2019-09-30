import { Expose } from 'class-transformer-imp';

export class LeagueDto {
	@Expose()
	id: number;
	@Expose()
	name: string;
	@Expose()
	image: string;
	@Expose()
	title: string;
}
