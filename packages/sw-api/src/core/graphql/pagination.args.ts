import { ArgsType, Field, Int } from '@shared/lib/utils/api/graphql';

@ArgsType()
export class PaginationArgs {
	@Field(() => Int, { nullable: true })
	limit?: number;

	@Field(() => Int, { nullable: true })
	skip?: number;
}

export const defaultPagination: PaginationArgs = {
	limit: 10,
	skip: 0,
};
