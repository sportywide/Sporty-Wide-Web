import { Type } from 'class-transformer-imp';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { PlayerRatingDto } from '@shared/lib/dtos/player/player-rating.dto';

export class FixtureDto {
	id: number;
	home: string;
	away: string;
	season: string;
	homeId: number;
	awayId: number;
	leagueId: number;
	homeScore: number;
	awayScore: number;
	link: string;
	status: string;
	current: number;
	@Type(() => Date)
	time: Date;
}

export class FixtureDetailsDto {
	fixture: FixtureDto;
	ratings: {
		home: {
			ratings: PlayerRatingDto;
			player: PlayerDto;
		}[];
		away: {
			ratings: PlayerRatingDto;
			player: PlayerDto;
		}[];
	};
}

export class WhoscoreFixture {
	time: Date;
	home: string;
	away: string;
	homeScore: number;
	link: string;
	awayScore: number;
	current: number;
	status: string;
	whoscoreLeagueId: number;
	incidents: any;
}
