import { TeamDto } from '@shared/lib/dtos/team/team.dto';
import { PlayerStatDto } from '@shared/lib/dtos/player/player-stat.dto';
import { Diff, MongooseDocument } from '@shared/lib/utils/types';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';

export class PlayerDto {
	id: number;
	name: string;
	age?: number;
	nationality: string;
	nationalityId?: number;
	positions: string[];
	shirt: number;
	teamName: string;
	team?: TeamDto;
	teamId: number;
	image: string;
	rating: number;
	stats?: PlayerStatDto;
}

export class UserPlayerDto extends PlayerDto {
	available: boolean;
	match: FixtureDto;
}

export interface ScoreboardPlayer extends Omit<Diff<PlayerStatDto, MongooseDocument>, 'playerId'> {
	jersey: number;
	nationality: string;
	age: number;
	name: string;
	status: string;
	url: string;
}
