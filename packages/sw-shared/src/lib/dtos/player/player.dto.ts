import { TeamDto } from '@shared/lib/dtos/team/team.dto';
import { Expose } from 'class-transformer-imp';
import { PlayerStatDto } from '@shared/lib/dtos/player/player-stat.dto';
import { Diff, MongooseDocument } from '@shared/lib/utils/types';

export class PlayerDto {
	@Expose()
	id: number;
	@Expose()
	name: string;
	@Expose()
	age?: number;
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

export interface ScoreboardPlayer extends Omit<Diff<PlayerStatDto, MongooseDocument>, 'playerId'> {
	jersey: number;
	nationality: string;
	age: number;
	name: string;
	status: string;
	url: string;
}
