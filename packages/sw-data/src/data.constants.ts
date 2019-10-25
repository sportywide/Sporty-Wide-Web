import path from 'path';

export const resourcesPath = path.resolve(process.cwd(), 'resources');

export type League = {
	name: string;
	id: number;
	whoscoreId: number;
	apiFootballId: number;
};
export const leagues: League[] = [
	{
		name: 'premier-league',
		id: 13,
		whoscoreId: 2,
		apiFootballId: 2,
	},
	{
		name: 'la-liga',
		id: 53,
		whoscoreId: 4,
		apiFootballId: 30,
	},
	{
		name: 'bundesliga',
		id: 19,
		whoscoreId: 3,
		apiFootballId: 8,
	},
	{
		name: 'serie-a',
		id: 31,
		whoscoreId: 5,
		apiFootballId: 28,
	},
	{
		name: 'ligue-1',
		id: 16,
		whoscoreId: 22,
		apiFootballId: 4,
	},
];
