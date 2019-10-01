import { Controller, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { LeagueService } from '@api/leagues/services/league.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { toDto } from '@api/utils/dto/transform';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { UserLeagueDto } from '@shared/lib/dtos/leagues/user-league.dto';
import { ActiveUser } from '@api/auth/decorators/user-check.decorator';

@Controller('/leagues')
export class LeagueController {
	constructor(private readonly leagueService: LeagueService) {}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Get('/')
	public async getLeagues() {
		const leagues = await this.leagueService.findAll();
		return leagues.map(league => toDto({ value: league, dtoType: LeagueDto }));
	}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Get('/user/:userId')
	public async getUserLeagues(@Param('userId', new ParseIntPipe()) userId: number) {
		const userLeagues = await this.leagueService.findUserLeagues(userId);
		return userLeagues.map(userLeague =>
			toDto({
				value: {
					...toDto({ value: userLeague.league, dtoType: LeagueDto }),
					createdAt: userLeague.createdAt,
				},
				dtoType: UserLeagueDto,
			})
		);
	}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Put('/:leagueId/user/:userId/join')
	public async joinLeague(
		@Param('userId', new ParseIntPipe()) userId: number,
		@Param('leagueId', new ParseIntPipe()) leagueId: number
	) {
		await this.leagueService.joinLeague(userId, leagueId);
	}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Put('/:leagueId/user/:userId/leave')
	public async leaveLeague(
		@Param('userId', new ParseIntPipe()) userId: number,
		@Param('leagueId', new ParseIntPipe()) leagueId: number
	) {
		await this.leagueService.leaveLeague(userId, leagueId);
	}
}
