import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { ActiveUser } from '@api/auth/decorators/user-check.decorator';
import { FixtureService } from '@api/fixtures/services/fixture.service';
import { toDto } from '@api/utils/dto/transform';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';

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
			options: {
				excludeExtraneousValues: false,
			},
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
			options: {
				excludeExtraneousValues: false,
			},
		});
	}
}
