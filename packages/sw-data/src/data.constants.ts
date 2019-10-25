import path from 'path';

export const resourcesPath = path.resolve(process.cwd(), 'resources');

export type League = {
	name: string;
	id: number;
	whoscoreId: number;
	apiFootballId: number;
	scoreboardUrl: string;
};
export const leagues: League[] = [
	{
		name: 'premier-league',
		id: 13,
		whoscoreId: 2,
		apiFootballId: 2,
		scoreboardUrl: '/england/epl/',
	},
	{
		name: 'la-liga',
		id: 53,
		whoscoreId: 4,
		apiFootballId: 30,
		scoreboardUrl: '/spain/laliga/',
	},
	{
		name: 'bundesliga',
		id: 19,
		whoscoreId: 3,
		apiFootballId: 8,
		scoreboardUrl: '/germany/bundesliga/',
	},
	{
		name: 'serie-a',
		id: 31,
		whoscoreId: 5,
		apiFootballId: 28,
		scoreboardUrl: '/italy/serie-a/',
	},
	{
		name: 'ligue-1',
		id: 16,
		whoscoreId: 22,
		apiFootballId: 4,
		scoreboardUrl: '/france/ligue-1/',
	},
];
