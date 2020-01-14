import {
	BadRequestException,
	Controller,
	Get,
	Post,
	Body,
	Param,
	ParseIntPipe,
	Query,
	UseGuards,
} from '@nestjs/common';
import { PlayerService } from '@schema/player/services/player.service';
import { parse, startOfWeek } from 'date-fns';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { toDto } from '@api/utils/dto/transform';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { LeagueService } from '@api/leagues/services/league.service';
import { keyBy } from 'lodash';
import { BusinessException } from '@shared/lib/exceptions/business-exception';
import { UserPlayersDocument } from '@schema/player/models/user-players.schema';
import { CurrentUser } from '@api/core/decorators/user';
import { ActiveUser } from '@api/auth/decorators/user-check.decorator';
import { User } from '@schema/user/models/user.entity';
import { FixtureService } from '@schema/fixture/services/fixture.service';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';
import { PlayerBettingService } from '@schema/player/services/player-betting.service';
import { toISO } from '@shared/lib/utils/date/conversion';

@Controller('/player')
export class PlayerController {
	constructor(
		private readonly playerService: PlayerService,
		private readonly leagueService: LeagueService,
		private readonly fixtureService: FixtureService,
		private readonly playerBettingService: PlayerBettingService
	) {}

	@ActiveUser()
	@UseGuards(JwtAuthGuard)
	@Get('/me/league/:leagueId')
	async getUserPlayers(
		@CurrentUser() user: User,
		@Param('leagueId', new ParseIntPipe()) leagueId: number,
		@Query('date') dateString: string,
		@Query('includes') includes: string[]
	) {
		includes = includes || [];
		if (!Array.isArray(includes)) {
			throw new BadRequestException('Not a valid include array');
		}
		this.validateLeague(leagueId);
		const date = this.validateDate(dateString);
		const generatePlayerResult = await this.getOrCreatePlayers({
			userId: user.id,
			leagueId,
			date,
		});
		const { players: playerIds } = generatePlayerResult;
		if (!(playerIds && playerIds.length)) {
			return generatePlayerResult;
		}

		const players = await this.playerService.getPlayerByIds(
			playerIds,
			includes.filter(include => include !== 'stats')
		);
		let playerDtos = toDto({
			value: players,
			dtoType: PlayerDto,
		}) as PlayerDto[];
		if (includes.includes('stats')) {
			const playerStats = await this.playerService.getPlayerStats(players.map(player => player.id));
			const statMap = keyBy(playerStats, 'playerId');
			playerDtos = playerDtos.map(player => ({
				...player,
				stats: statMap[player.id] && statMap[player.id].toJSON(),
			}));
		}
		return {
			...(generatePlayerResult as UserPlayersDocument).toJSON(),
			players: playerDtos,
			preference: await this.leagueService.getUserLeaguePreference({ userId: user.id, leagueId }),
		};
	}

	@ActiveUser()
	@UseGuards(JwtAuthGuard)
	@Get('/me/lineup/:leagueId')
	async getUserLineUp(
		@CurrentUser() user: User,
		@Param('leagueId', new ParseIntPipe()) leagueId: number,
		@Query('date') dateString: string
	) {
		this.validateLeague(leagueId);
		const date = this.validateDate(dateString);
		const generatePlayerResult = await this.getOrCreatePlayers({
			userId: user.id,
			leagueId,
			date,
		});
		const { players: playerIds } = generatePlayerResult;
		if (!(playerIds && playerIds.length)) {
			return generatePlayerResult;
		}

		const players = await this.playerService.getPlayerByIds(playerIds, ['team']);
		let playerDtos: PlayerDto[] = toDto({ value: players, dtoType: PlayerDto });
		const teamIds = players.map(player => player.teamId);
		const fixtureForTeams = await this.fixtureService.getWeeklyMatchesForTeams(teamIds);
		playerDtos = playerDtos.map(playerDto => {
			const match = toDto({
				value: fixtureForTeams[playerDto.teamId],
				dtoType: FixtureDto,
			});
			return {
				...playerDto,
				match,
				available: match && match.time > new Date(),
			};
		});

		const positions = await this.playerBettingService.getBettingPositions({
			leagueId,
			userId: user.id,
			week: date,
		});

		return {
			...(generatePlayerResult as UserPlayersDocument).toJSON(),
			positions,
			players: playerDtos,
		};
	}

	@ActiveUser()
	@UseGuards(JwtAuthGuard)
	@Get('/me/betting/:leagueId')
	async getMyBetting(
		@CurrentUser() user: User,
		@Param('leagueId', new ParseIntPipe()) leagueId: number,
		@Query('date') dateString: string
	) {
		this.validateLeague(leagueId);
		const date = this.validateDate(dateString);
		const positions = await this.playerBettingService.getBetting(
			{
				leagueId,
				userId: user.id,
				week: date,
			},
			['player', 'fixture']
		);

		return toDto({
			value: positions,
		});
	}

	@ActiveUser()
	@UseGuards(JwtAuthGuard)
	@Get('/me/check/betting/:leagueId')
	async hasBetting(
		@CurrentUser() user: User,
		@Param('leagueId', new ParseIntPipe()) leagueId: number,
		@Query('date') dateString: string
	) {
		this.validateLeague(leagueId);
		const date = this.validateDate(dateString);
		const hasBetting = await this.playerBettingService.hasBetting({
			leagueId,
			userId: user.id,
			week: date,
		});

		return {
			hasBetting,
		};
	}

	@ActiveUser()
	@UseGuards(JwtAuthGuard)
	@Post('/me/lineup/:leagueId')
	async postMyLineup(
		@CurrentUser() user: User,
		@Param('leagueId', new ParseIntPipe()) leagueId: number,
		@Query('date') dateString: string,
		@Body() body: { positions: number[] }
	) {
		let { positions } = body;
		this.validateLeague(leagueId);
		const date = this.validateDate(dateString);
		if (date > new Date()) {
			throw new BadRequestException('Invalid date');
		}
		const existingBetting = await this.playerBettingService.getBetting({ userId: user.id, week: date, leagueId });
		if (existingBetting.length) {
			return;
		}
		const ownedPlayers = await this.playerService.getOwnedPlayers({ userId: user.id, leagueId, date });
		positions = positions.filter(position => !position || ownedPlayers.players.includes(position));
		if (!positions.length) {
			throw new BadRequestException('Must specify at least a valid player');
		}
		const playerMappedByIds = await this.playerService.getMappedByIds(positions);
		const players = Object.values(playerMappedByIds);
		const teamIds = players.map(player => player.teamId);
		const fixtureMap = await this.fixtureService.getNextFixturesForTeams(teamIds);
		for (const [playerId, player] of Object.entries(playerMappedByIds)) {
			if (!fixtureMap[player.teamId]) {
				delete playerMappedByIds[playerId];
			}
		}
		if (!Object.keys(playerMappedByIds).length) {
			return;
		}
		const playerBetting = await this.playerBettingService.save(
			Object.entries(playerMappedByIds).map(([playerId, player]) => {
				const parsedPlayerId = parseInt(playerId, 10);
				return {
					playerId: parsedPlayerId,
					teamId: player.teamId,
					fixtureId: fixtureMap[player.teamId].id,
					leagueId,
					userId: user.id,
					week: toISO(date),
					pos: positions.indexOf(parsedPlayerId),
				};
			})
		);
		return toDto({
			value: playerBetting,
		});
	}

	private async validateLeague(leagueId) {
		const leagueExists = await this.leagueService.count({
			where: {
				id: leagueId,
			},
		});
		if (!leagueExists) {
			throw new BadRequestException('League does not exist');
		}
	}

	private validateDate(dateString) {
		const date = dateString ? parse(dateString, 'yyyy-MM-dd', new Date()) : new Date();
		return startOfWeek(date, { weekStartsOn: 1 });
	}

	private async getOrCreatePlayers({ userId, leagueId, date }) {
		let userPlayers: UserPlayersDocument;
		try {
			userPlayers = await this.playerService.getOrCreatePlayersForUser({
				userId,
				leagueId,
				date,
			});
			return userPlayers;
		} catch (e) {
			if (e instanceof BusinessException) {
				return {
					players: [],
					errorCode: e.code,
					errorMessage: e.message,
				};
			}
			throw e;
		}
	}
}
