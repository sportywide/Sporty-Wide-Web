import { Inject, Service } from 'typedi';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { of, Observable } from 'rxjs';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';

@Service({
	global: true,
})
export class UserLeagueService {
	constructor(@Inject('currentUser') private readonly currentUser: IUser) {}

	loadUserLeagues(userId: number): Observable<LeagueDto[]> {
		return of([
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
		]);
	}
}
