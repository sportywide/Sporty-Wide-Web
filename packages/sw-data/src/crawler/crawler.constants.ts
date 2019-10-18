import path from 'path';

export const resourcesPath = path.resolve(process.cwd(), 'resources');

export const leagues = [
	{
		name: 'premier-league',
		id: 13,
		whoscoreId: 2,
	},
	{
		name: 'la-liga',
		id: 53,
		whoscoreId: 4,
	},
	{
		name: 'bundesliga',
		id: 19,
		whoscoreId: 3,
	},
	{
		name: 'serie-a',
		id: 31,
		whoscoreId: 5,
	},
	{
		name: 'ligue-1',
		id: 16,
		whoscoreId: 22,
	},
];
