export type ScoreboardTeam = {
	name: string;
	url: string;
	played: number;
	wins: number;
	draws: number;
	losses: number;
	scored: number;
	conceded: number;
	points: number;
	forms: { type: string; teams: string; score: string; date: string }[];
};

export type ScoreboardPlayer = {
	jersey: number;
	nationality: string;
	age: number;
	played: number;
	name: string;
	scored: number;
	yellow: number;
	red: number;
	status: string;
};

export class LeagueStandingsDto {
	leagueId: number;
	season: number;
	table: (ScoreboardTeam & { teamId: string })[];
}
