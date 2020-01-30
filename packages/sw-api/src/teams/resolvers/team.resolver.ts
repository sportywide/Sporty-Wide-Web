import { Args, Query, Resolver } from '@nestjs/graphql';
import { toDto } from '@api/utils/dto/transform';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { ActiveUser } from '@api/auth/decorators/user-check.decorator';
import { TeamDto } from '@shared/lib/dtos/team/team.dto';
import { TeamFilteredInput, TeamService } from '@schema/team/services/team.service';
import { Field, Int, ObjectType } from '@shared/lib/utils/api/graphql';

@ObjectType()
class TeamPaginationResult {
	@Field(() => [TeamDto])
	items: TeamDto[];

	@Field(() => Int)
	count: number;
}

@Resolver(() => TeamDto)
export class TeamsResolver {
	constructor(private readonly teamService: TeamService) {}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Query(() => TeamPaginationResult)
	async teams(@Args() filtered: TeamFilteredInput) {
		const { items: teams, count } = await this.teamService.filteredList(filtered);
		return {
			count,
			items: teams.map(team =>
				toDto({
					value: team,
					dtoType: TeamDto,
				})
			),
		};
	}

	@Query(() => TeamDto)
	async team(@Args('id') id: number) {
		const team = await this.teamService.findById({ id });
		return toDto({
			value: team,
			dtoType: TeamDto,
		});
	}
}
