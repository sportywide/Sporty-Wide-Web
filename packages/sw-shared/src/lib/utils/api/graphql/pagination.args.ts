import { ArgsType, Field, Int } from '@shared/lib/utils/api/graphql/index';

@ArgsType()
export class PaginationArgs {
	@Field(() => Int, { nullable: true })
	limit?: number;

	@Field(() => Int, { nullable: true })
	skip?: number;

	@Field({ nullable: true })
	sort?: string;

	@Field(() => Boolean, { nullable: true })
	asc?: boolean;
}

export const defaultPagination: PaginationArgs = {
	limit: 10,
	skip: 0,
	asc: true,
	sort: 'id',
};
