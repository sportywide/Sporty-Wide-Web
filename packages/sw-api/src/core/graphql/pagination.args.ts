import { ArgsType, Field, Int } from '@shared/lib/utils/api/graphql';

@ArgsType()
export class PaginationArgs {
	@Field(type => Int, { nullable: true })
	limit?: number;

	@Field(type => Int, { nullable: true })
	skip?: number;
}

export const defaultPagination: PaginationArgs = {
	limit: 10,
	skip: 0,
};
