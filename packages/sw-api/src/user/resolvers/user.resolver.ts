import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { UserService } from '@api/user/services/user.service';
import { toDto } from '@api/shared/dto/transform';

@Resolver()
export class UsersResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => [UserDto])
	async users() {
		const users = await this.userService.findAll();
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
}
