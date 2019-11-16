import { Inject, Service } from 'typedi';
import { ApiService } from '@web/shared/lib/http/api.service';
import { of } from 'rxjs';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';

@Service()
export class ProfilePlayersService {
	constructor(
		@Inject(type => ApiService)
		private readonly apiService: ApiService
	) {}

	getProfilePlayers(userId: string) {
		return of(players);
	}
}

const players: PlayerDto[] = [
	{
		id: 192985,
		image: '/static/FIFA20/images/players/5/192985.png',
		rating: 91,
		name: 'Kevin De Bruyne',
		positions: ['CAM', 'CM'],
		age: 28,
		shirt: 17,
		teamName: 'Manchester City',
		team: {
			id: 10,
			name: 'Manchester City',
			image: '/static/FIFA20/images/crest/5/light/10.png',
		}
	},
	{
		id: 209331,
		image: '/static/FIFA20/images/players/5/209331.png',
		rating: 90,
		name: 'Mohamed Salah',
		positions: ['RW', 'ST'],
		age: 27,
		shirt: 11,
		teamName: 'Liverpool',
		team: {
			id: 9,
			name: 'Liverpool',
			image: '/static/FIFA20/images/crest/5/light/9.png',
		}
	},
];
