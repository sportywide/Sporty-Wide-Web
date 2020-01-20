import { Type } from 'class-transformer-imp';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { PlayerRatingDto } from '@shared/lib/dtos/player/player-rating.dto';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { TeamDto } from '@shared/lib/dtos/team/team.dto';

export class FixtureDto {
	id: number;
	home: string;
	away: string;
	season: string;
	homeId: number;
	awayId: number;
	leagueId: number;
	incidents: any[];
	@Type(() => LeagueDto)
	league: LeagueDto;
	homeScore: number;
	awayScore: number;
	link: string;
	status: string;
	current: number;
	@Type(() => Date)
	time: Date;
	@Type(() => TeamDto)
	homeTeam: TeamDto;
	@Type(() => TeamDto)
	awayTeam: TeamDto;
}

export class FixturePlayerRatingDto {
	@Type(() => PlayerRatingDto)
	rating: PlayerRatingDto;

	@Type(() => PlayerDto)
	player: PlayerDto;
}

export class FixtureRatingsDto {
	@Type(() => FixturePlayerRatingDto)
	home: FixturePlayerRatingDto[];

	@Type(() => FixturePlayerRatingDto)
	away: FixturePlayerRatingDto[];
}

export class FixtureDetailsDto {
	@Type(() => FixtureDto)
	fixture: FixtureDto;

	@Type(() => FixtureRatingsDto)
	ratings: FixtureRatingsDto;
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
