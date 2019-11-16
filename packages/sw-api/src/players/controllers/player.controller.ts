import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PlayerService } from '@schema/player/services/player.service';
import { parse, startOfWeek } from 'date-fns';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { toDto } from '@api/utils/dto/transform';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';

@Controller('/player')
export class PlayerController {
	constructor(private readonly playerService: PlayerService) {}

	@UseGuards(JwtAuthGuard)
	@Get('/user/:userId/league/:leagueId')
	async getUserPlayers(
		@Param('userId') userId: number,
		@Param('leagueId') leagueId: number,
		@Query('date') dateString: string
	) {
		let date = dateString ? parse(dateString, 'yyyy-MM-dd', new Date()) : new Date();
		date = startOfWeek(date, { weekStartsOn: 1 });
		const userPlayers = await this.playerService.getPlayersForUser({
			userId,
			leagueId,
			date,
		});
		if (!userPlayers) {
			return userPlayers;
		}

		return {
			...userPlayers.toJSON(),
			players: toDto({ value: await this.playerService.getPlayerByIds(userPlayers.players), dtoType: PlayerDto }),
		};
	}
}
