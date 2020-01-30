import { Field, InputType, Int } from '@shared/lib/utils/api/graphql';

@InputType()
export class TeamListFilteredDto {
	@Field(() => Int, { nullable: true })
	leagueId: number;

	@Field({ nullable: true })
	search?: string;
}
