import { TeamDto } from '@shared/lib/dtos/team/team.dto';
import { PlayerStatDto } from '@shared/lib/dtos/player/player-stat.dto';
import { Diff, MongooseDocument } from '@shared/lib/utils/types';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';

export class PlayerDto {
	id: number;
	name: string;
	age?: number;
	nationality?: string;
	nationalityId?: number;
	positions: string[];
	shirt: number;
	teamName: string;
	team?: TeamDto;
	teamId?: number;
	image: string;
	rating: number;
	stats?: PlayerStatDto;
}

export class UserPlayerDto extends PlayerDto {
	available?: boolean;
	match?: FixtureDto;
}

export interface ScoreboardPlayer extends Omit<Diff<PlayerStatDto, MongooseDocument>, 'playerId'> {
	jersey: number;
	nationality: string;
	age: number;
	name: string;
	status: string;
	url: string;
}

export interface EspnPlayer extends Omit<Diff<PlayerStatDto, MongooseDocument>, 'playerId'> {
	jersey: number;
	name: string;
}

export function getShortName(playerName) {
	const parts = playerName.split(/\s+/);
	let names = [];
	if (parts.length >= 3) {
		names = [parts[0], parts[parts.length - 1]];
	} else {
		names = parts;
	}

	if (names.length === 2) {
		return `${names[0][0]}.${names[1]}`;
	} else {
		return names[0];
	}
}
