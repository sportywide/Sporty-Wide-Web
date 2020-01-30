import { Field, Int, ObjectType } from '@shared/lib/utils/api/graphql';

@ObjectType()
export class TeamDto {
	@Field(() => Int)
	id: number;

	@Field()
	name: string;

	@Field()
	image: string;

	@Field()
	title: string;

	@Field(() => Int)
	leagueId: number;

	@Field()
	league: string;

	@Field(() => Int)
	att: number;

	@Field(() => Int)
	mid: number;

	@Field(() => Int)
	def: number;

	@Field(() => Int)
	ovr: number;

	@Field()
	rating: string;
}
