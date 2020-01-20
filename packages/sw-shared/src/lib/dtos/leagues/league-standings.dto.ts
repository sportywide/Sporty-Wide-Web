import { MongooseDocument } from '@shared/lib/utils/types';

export class ScoreboardTeam {
	name: string;
	url: string;
	played: number;
	wins: number;
	teamId?: string;
	draws: number;
	losses: number;
	scored: number;
	conceded: number;
	points: number;
	forms: Form[];
}

export class Form {
	type: string;
	teams: string;
	score: string;
	date: string;
}

export class LeagueStandingsDto extends MongooseDocument {
	leagueId: number;
	season: string;
	table: ScoreboardTeam[];
}
