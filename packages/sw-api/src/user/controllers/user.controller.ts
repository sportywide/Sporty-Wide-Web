import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	ParseIntPipe,
	Put,
	Query,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { CurrentUser } from '@api/core/decorators/user';
import { UserService } from '@api/user/services/user.service';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { AuthorizedApiOperation, NotFoundResponse } from '@api/core/decorators/api-doc';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { plainToClass } from 'class-transformer-imp';
import { ApiValidationService } from '@api/core/services/validation/validation.service';
import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { User } from '@schema/user/models/user.entity';
import { EnvGuard } from '@api/auth/guards/environment.guard';
import { UserProfileDto } from '@shared/lib/dtos/user/profile/user-profile.dto';
import { UserProfileService } from '@api/user/services/user-profile.service';
import { filterValues } from '@shared/lib/utils/object/filter';

@ApiUseTags('users')
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly userProfileService: UserProfileService,
		private readonly apiValidationService: ApiValidationService
	) {}

	@AuthorizedApiOperation({ title: 'Get current user endpoint' })
	@ApiOkResponse({ description: 'Return the currently authenticated user', type: UserDto })
	@UseGuards(JwtAuthGuard)
	@Get('me')
	public getCurrentUser(@CurrentUser() user): UserDto {
		return plainToClass(UserDto, user, {
			excludeExtraneousValues: true,
		});
	}

	@ApiOkResponse({ description: 'User has been retrieved' })
	@ApiOperation({ title: 'Find the user by token' })
	@Get('token')
	@HttpCode(HttpStatus.OK)
	public async findByToken(@Query('token') token: string) {
		const user = await this.userService.findByToken({ token });
		return plainToClass(UserDto, user, {
			excludeExtraneousValues: true,
		});
	}

	@AuthorizedApiOperation({ title: 'Get user endpoint' })
	@ApiOkResponse({ description: 'Return the user with specified id', type: UserDto })
	@NotFoundResponse('user')
	@UseGuards(JwtAuthGuard)
	@Get(':id')
	public async getUser(@Param('id') id: number): Promise<UserDto> {
		const user = await this.userService.findById({ id });
		if (!user) {
			throw new NotFoundException(`User with id ${id} cannot be found`);
		}
		return plainToClass(UserDto, user, {
			excludeExtraneousValues: true,
		});
	}

	@ApiOkResponse({ description: 'User has been deleted' })
	@AuthorizedApiOperation({ title: 'Delete user by username, only available in development environment' })
	@Delete('test/:username')
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(EnvGuard.development())
	public deleteUserByUsername(@Param('username') username: string) {
		return this.userService.delete({ username });
	}

	@AuthorizedApiOperation({ title: 'Update user endpoint' })
	@ApiOkResponse({ description: 'Update an user', type: UserDto })
	@NotFoundResponse('user')
	@UseGuards(JwtAuthGuard)
	@Put(':id')
	public async updateUser(
		@Param('id', new ParseIntPipe())
		id: number,
		@Body() updateParams: Partial<CreateUserDto>,
		@CurrentUser() currentUser
	): Promise<UserDto> {
		if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
			throw new UnauthorizedException('You are not allowed to edit other users');
		}
		const user = await this.userService.findById({ id, cache: true });
		if (!user) {
			throw new NotFoundException(`User with id ${id} cannot be found`);
		}

		let updatedUser = await this.apiValidationService.validatePatch({
			originalValues: user,
			patch: updateParams,
			objectType: CreateUserDto,
		});

		updatedUser = await this.userService.saveOne(updatedUser as User);

		return plainToClass(UserDto, updatedUser, {
			excludeExtraneousValues: true,
		});
	}

	@AuthorizedApiOperation({ title: 'Update user profile endpoint' })
	@ApiOkResponse({ description: 'Update an user profile', type: UserProfileDto })
	@NotFoundResponse('user')
	@UseGuards(JwtAuthGuard)
	@Put('profile/:id')
	public async updateUserProfile(
		@Param('id', new ParseIntPipe())
		id: number,
		@Body() updateParams: Partial<UserProfileDto>,
		@CurrentUser() currentUser
	): Promise<UserProfileDto> {
		if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
			throw new UnauthorizedException('You are not allowed to edit other users');
		}
		const relations = ['profile'];
		if (updateParams.address) {
			relations.push('profile.address');
		}
		const user = await this.userService.findById({ id, cache: true, relations });
		if (!user) {
			throw new NotFoundException(`User with id ${id} cannot be found`);
		}
		let userProfile;
		if (!user.profile) {
			let validatedParams: Partial<UserProfileDto> = this.apiValidationService.strip({
				value: updateParams,
				objectType: UserProfileDto,
			});
			validatedParams = await this.apiValidationService.validate({
				object: validatedParams,
				schemaName: UserProfileDto,
			});
			userProfile = await this.userService.createUserProfile(user, validatedParams as UserProfileDto);
		} else {
			const validatedParams: any = await this.apiValidationService.validatePatch({
				patch: updateParams,
				originalValues: user.profile,
				objectType: UserProfileDto,
			});
			userProfile = await this.userProfileService.saveOne(validatedParams);
		}

		return filterValues(
			plainToClass(UserProfileDto, userProfile, {
				excludeExtraneousValues: true,
				ignoreDecorators: true,
			}),
			(value, key) => {
				return !key || !key.startsWith('_');
			}
		);
	}
}
