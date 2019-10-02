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
import { ApiValidationService } from '@api/core/services/validation/validation.service';
import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { EnvGuard } from '@api/auth/guards/environment.guard';
import { UserProfileDto } from '@shared/lib/dtos/user/profile/user-profile.dto';
import { UserProfileService } from '@api/user/services/user-profile.service';
import { toDto } from '@api/utils/dto/transform';
import { ActiveUser } from '@api/auth/decorators/user-check.decorator';

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
		return toDto({
			value: user,
			dtoType: UserDto,
		});
	}

	@ApiOkResponse({ description: 'User has been retrieved' })
	@ApiOperation({ title: 'Find the user by token' })
	@Get('token')
	@HttpCode(HttpStatus.OK)
	public async findByToken(@Query('token') token: string) {
		const user = await this.userService.findByToken({ token });
		return toDto({
			value: user,
			dtoType: UserDto,
		});
	}

	@AuthorizedApiOperation({ title: 'Get user endpoint' })
	@ApiOkResponse({ description: 'Return the user with specified id', type: UserDto })
	@NotFoundResponse('user')
	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Get(':id')
	public async getUser(@Param('id') id: number): Promise<UserDto> {
		const user = await this.userService.findById({ id });
		if (!user) {
			throw new NotFoundException(`User with id ${id} cannot be found`);
		}
		return toDto({
			value: user,
			dtoType: UserDto,
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
	@ActiveUser()
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

		updatedUser = this.userService.merge(user, updatedUser);
		updatedUser = await this.userService.saveOne(updatedUser);
		return toDto({
			value: updatedUser,
			dtoType: UserDto,
		});
	}

	@AuthorizedApiOperation({ title: 'Update user profile endpoint' })
	@ApiOkResponse({ description: 'Update an user profile', type: UserProfileDto })
	@NotFoundResponse('user')
	@UseGuards(JwtAuthGuard)
	@ActiveUser()
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
		const user = await this.userService.findById({ id, relations });
		if (!user) {
			throw new NotFoundException(`User with id ${id} cannot be found`);
		}
		let userProfile = await user.profile;
		if (!userProfile) {
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
				originalValues: userProfile,
				objectType: UserProfileDto,
			});

			const mergedUserProfile = this.userProfileService.merge(userProfile, validatedParams);
			userProfile = await this.userProfileService.saveOne(mergedUserProfile);
		}

		return toDto({
			value: userProfile,
			dtoType: UserProfileDto,
			options: {
				ignoreDecorators: true,
			},
		});
	}

	@AuthorizedApiOperation({ title: 'Get user profile endpoint' })
	@ApiOkResponse({ description: 'User profile has been retrieved', type: UserProfileDto })
	@NotFoundResponse('user')
	@UseGuards(JwtAuthGuard)
	@ActiveUser()
	@Get('profile/:id')
	public async getUserProfile(
		@Param('id', new ParseIntPipe()) id: number,
		@Query() query: any
	): Promise<UserProfileDto> {
		const allowedRelations = ['address'];
		const relations = (query.relations || [])
			.filter(relation => allowedRelations.includes(relation))
			.map(relation => `profile.${relation}`);
		const user = await this.userService.findById({ id, relations: ['profile', ...relations] });
		if (!user) {
			throw new NotFoundException(`User with id ${id} cannot be found`);
		}

		return toDto({
			value: user.profile || {},
			dtoType: UserProfileDto,
			options: {
				ignoreDecorators: true,
			},
		});
	}
}
