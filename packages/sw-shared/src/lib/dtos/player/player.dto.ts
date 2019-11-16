import { TeamDto } from '@shared/lib/dtos/team/team.dto';
import { Expose } from 'class-transformer-imp';

export class PlayerDto {
	@Expose()
	id: number;
	@Expose()
	name: string;
	@Expose()
	age: number;
	@Expose()
	nationality: string;
	@Expose()
	nationalityId?: number;
	@Expose()
	positions: string[];
	@Expose()
	shirt: number;
	@Expose()
	teamName: string;
	@Expose()
	team?: TeamDto;
	@Expose()
	teamId: number;
	@Expose()
	image: string;
	@Expose()
	rating: number;
}
