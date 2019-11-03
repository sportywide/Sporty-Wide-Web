import { TeamDto } from '@shared/lib/dtos/team/team.dto';

export class PlayerDto {
	id: number;
	name: string;
	positions: string[];
	shirt: number;
	teamName: string;
	team?: TeamDto;
	image: string;
	rating: number;
	age?: number;
}
