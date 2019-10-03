import { Args, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { UserService } from '@api/user/services/user.service';
import { toDto } from '@api/utils/dto/transform';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { ActiveUser } from '@api/auth/decorators/user-check.decorator';
import { UserProfileDto } from '@shared/lib/dtos/user/profile/user-profile.dto';
import { UserProfileService } from '@api/user/services/user-profile.service';
import { defaultPagination, PaginationArgs } from '@api/core/graphql/pagination.args';

@Resolver(() => UserDto)
export class UsersResolver {
	constructor(private readonly userService: UserService, private readonly userProfileService: UserProfileService) {}

	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Query(() => [UserDto])
	async users(@Args() pagination: PaginationArgs) {
		pagination = { ...defaultPagination, ...(pagination || {}) };
		const users = await this.userService.find({
			take: pagination.limit,
			skip: pagination.skip,
		});
		return users.map(user =>
			toDto({
				value: user,
				dtoType: UserDto,
			})
		);
	}

	@Query(() => UserDto)
	async user(@Args('id') id: number) {
		const user = await this.userService.findById({ id });
		return toDto({
			value: user,
			dtoType: UserDto,
		});
	}

	@ResolveProperty()
	async profile(@Parent() userDto: UserDto) {
		const id = userDto.id;
		const userProfile = await this.userProfileService.findIdByDataLoader({
			id,
			options: { property: 'userId' },
		});
		if (!userProfile) {
			return null;
		}
		return toDto({
			value: userProfile,
			dtoType: UserProfileDto,
		});
	}
}
