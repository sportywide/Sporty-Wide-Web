import { Controller, Get, Param, Query, UseGuards, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { PlayerService } from '@schema/player/services/player.service';
import { parse, startOfWeek } from 'date-fns';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { toDto } from '@api/utils/dto/transform';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { LeagueService } from '@api/leagues/services/league.service';

@Controller('/player')
export class PlayerController {
	constructor(private readonly playerService: PlayerService, private readonly leagueService: LeagueService) {}

	@UseGuards(JwtAuthGuard)
	@Get('/user/:userId/league/:leagueId')
	async getUserPlayers(
		@Param('userId', new ParseIntPipe()) userId: number,
		@Param('leagueId', new ParseIntPipe()) leagueId: number,
		@Query('date') dateString: string,
		@Query('includes') includes: string[]
	) {
		if (includes && !Array.isArray(includes)) {
			throw new BadRequestException('Not a valid include array');
		}
		const leagueExists = await this.leagueService.count({
			where: {
				id: leagueId,
			},
		});
		if (!leagueExists) {
			throw new BadRequestException('League does not exist');
		}
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
			players: toDto({
				value: await this.playerService.getPlayerByIds(userPlayers.players, includes),
				dtoType: PlayerDto,
			}),
			preference: await this.leagueService.getUserLeaguePreference({ userId, leagueId }),
		};
	}
}
