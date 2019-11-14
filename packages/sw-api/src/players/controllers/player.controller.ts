import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlayerService } from '@schema/player/services/player.service';
import { parse, startOfWeek } from 'date-fns';

@Controller('/players')
export class PlayerController {
	constructor(private readonly playerService: PlayerService) {}

	@Get('/users/:userId/league/:leagueId')
	getUserPlayers(
		@Param('userId') userId: number,
		@Param('leagueId') leagueId: number,
		@Query('date') dateString: string
	) {
		let date = dateString ? parse(dateString, 'yyyy-MM-dd', new Date()) : new Date();
		date = startOfWeek(date, { weekStartsOn: 1 });
		return this.playerService.getPlayersForUser({
			userId,
			leagueId,
			date,
		});
	}
}
