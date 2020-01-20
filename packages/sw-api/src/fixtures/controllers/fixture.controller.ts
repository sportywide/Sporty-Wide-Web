import { Controller, Get, Param, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { ActiveUser } from '@api/auth/decorators/user-check.decorator';
import { toDto } from '@api/utils/dto/transform';
import { FixtureDetailsDto, FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';
import { FixtureService } from '@schema/fixture/services/fixture.service';
import { fromISO } from '@shared/lib/utils/date/conversion';
import { isValidDate } from '@shared/lib/utils/date/validation';

@Controller('/fixtures')
export class FixtureController {
	constructor(private readonly fixtureService: FixtureService) {}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Get('/week/:id/')
	public async getFixturesThisWeek(@Param('id') leagueId: number) {
		const fixtures = await this.fixtureService.findMatchesForWeek({
			leagueId,
		});
		return toDto({
			dtoType: FixtureDto,
			value: fixtures,
		});
	}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Get('/range/:id/')
	public async getFixturesForRange(
		@Param('id') leagueId: number,
		@Query('start') startStr: string,
		@Query('end') endStr: string
	) {
		if (!(startStr && endStr)) {
			return [];
		}
		const start = fromISO(startStr);
		const end = fromISO(endStr);
		if (!(isValidDate(start) && isValidDate(end) && start < end)) {
			return [];
		}
		const fixtures = await this.fixtureService.findMatchesInRange({
			leagueId,
			start,
			end,
		});
		return toDto({
			dtoType: FixtureDto,
			value: fixtures,
		});
	}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Get('/team/upcoming')
	public async getNextFixturesForTeams(@Query('team_id') teamIds: number[]) {
		const fixtures = await this.fixtureService.getNextFixturesForTeams(teamIds);
		return toDto({
			value: fixtures,
		});
	}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Get('/team/weekly')
	public async getWeeklyMatchesForTeams(@Query('team_id') teamIds: number[]) {
		const fixtures = await this.fixtureService.getWeeklyMatchesForTeams(teamIds);
		return toDto({
			value: fixtures,
		});
	}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Get('/:id/:season')
	public async getFixtures(@Param('id') leagueId: number, @Param('season') season: string) {
		const fixtures = await this.fixtureService.findMatchesForLeague({
			season,
			leagueId,
		});
		return toDto({
			value: fixtures,
			dtoType: FixtureDto,
		});
	}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Get('/:id')
	public async getFixture(@Param('id', new ParseIntPipe()) fixtureId: number): Promise<FixtureDetailsDto> {
		const fixture = await this.fixtureService.getFixtureDetails(fixtureId);
		return toDto({
			value: fixture,
		});
	}
}
