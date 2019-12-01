import { Type } from 'class-transformer-imp';

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
