export class PlayerStatDto {
	scored: number;
	yellow: number;
	red: number;
	played: number;
	subbed: number;
	assist?: number;
	playerId: number;
	leagueId?: number;
	teamId?: number;
	season: string;
	chance?: number;
	foulsCommitted?: number;
	foulsSuffered?: number;
	shots?: number;
	shotsOnTarget?: number;
	saves?: number;
}
