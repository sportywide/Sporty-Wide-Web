import { BadRequestException, Controller, Get, Param, ParseIntPipe, Put, Query, UseGuards } from '@nestjs/common';
import { LeagueService } from '@api/leagues/services/league.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { toDto } from '@api/utils/dto/transform';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { UserLeagueDto } from '@shared/lib/dtos/leagues/user-league.dto';
import { ActiveUser } from '@api/auth/decorators/user-check.decorator';
import { formationMap, FormationName } from '@shared/lib/dtos/formation/formation.dto';
import { LeagueStandingsDto } from '@shared/lib/dtos/leagues/league-standings.dto';
import { CurrentUser } from '@api/core/decorators/user';
import { User } from '@schema/user/models/user.entity';
import { getPastSeason } from '@shared/lib/utils/season';

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
	@Get('/standings/:id')
	public async getLeagueStandings(@Param('id') leagueId: number) {
		return toDto({
			value: await this.leagueService.findLeagueStanding(leagueId, getPastSeason(new Date())),
			dtoType: LeagueStandingsDto,
		});
	}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Get('/:id')
	public async getLeague(@Param('id', new ParseIntPipe()) leagueId: number) {
		return toDto({ value: await this.leagueService.findById({ id: leagueId }), dtoType: LeagueDto });
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
		@Param('leagueId', new ParseIntPipe()) leagueId: number,
		@Query('formation') formation: FormationName,
		@CurrentUser() currentUser: User
	) {
		if (currentUser.id !== userId) {
			throw new BadRequestException('Denied action');
		}
		formation = formation || '4-4-2';
		if (!formationMap[formation]) {
			throw new BadRequestException('Not a valid formation');
		}
		await this.leagueService.joinLeague({ userId, leagueId, formation });
	}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Put('/:leagueId/user/:userId/formation')
	public async setPreferredFormation(
		@Param('userId', new ParseIntPipe()) userId: number,
		@Param('leagueId', new ParseIntPipe()) leagueId: number,
		@Query('formation') formation: FormationName,
		@CurrentUser() currentUser: User
	) {
		if (currentUser.id !== userId) {
			throw new BadRequestException('Denied action');
		}
		formation = formation || '4-4-2';
		if (!formationMap[formation]) {
			throw new BadRequestException('Not a valid formation');
		}
		await this.leagueService.setPreferredFormation({ userId, leagueId, formation });
	}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Get('/:leagueId/user/:userId/preference')
	public async getUserLeaguePreference(
		@Param('userId', new ParseIntPipe()) userId: number,
		@Param('leagueId', new ParseIntPipe()) leagueId: number
	) {
		await this.leagueService.getUserLeaguePreference({ userId, leagueId });
	}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Put('/:leagueId/user/:userId/leave')
	public async leaveLeague(
		@Param('userId', new ParseIntPipe()) userId: number,
		@Param('leagueId', new ParseIntPipe()) leagueId: number,
		@CurrentUser() currentUser: User
	) {
		if (currentUser.id !== userId) {
			throw new BadRequestException('Denied action');
		}
		await this.leagueService.leaveLeague(userId, leagueId);
	}
}
