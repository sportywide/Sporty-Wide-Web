import { Injectable } from '@nestjs/common';

@Injectable()
export class LeagueService {
	public findAll() {
		return [
			{
				name: 'premier-league',
				title: 'Premier League',
				image: '/static/leagues/premier-league.svg',
			},
			{
				name: 'la-liga',
				title: 'La Liga',
				image: '/static/leagues/laliga.svg',
			},
			{
				name: 'bundesliga',
				title: 'Bundesliga',
				image: '/static/leagues/bundesliga.svg',
			},
			{
				name: 'serie-a',
				title: 'Serie A',
				image: '/static/leagues/serie-a.svg',
			},
			{
				name: 'ligue-one',
				title: 'League One',
				image: '/static/leagues/serie-a.svg',
			},
		];
	}
}
