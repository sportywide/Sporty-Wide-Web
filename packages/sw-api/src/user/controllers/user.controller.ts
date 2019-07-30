import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Patch,
	Put,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { CurrentUser } from '@api/core/decorators/user';
import { UserService } from '@api/user/services/user.service';
import { ApiOkResponse, ApiUseTags } from '@nestjs/swagger';
import { AuthorizedApiOperation, NotFoundResponse } from '@api/core/decorators/api-doc';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { plainToClass } from 'class-transformer-imp';
import { ApiValidationService } from '@api/core/services/validation/validation.service';
import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { User } from '@schema/user/models/user.entity';

@ApiUseTags('users')
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
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

	@AuthorizedApiOperation({ title: 'Get user endpoint' })
	@ApiOkResponse({ description: 'Return the user with specified id', type: UserDto })
	@NotFoundResponse('user')
	@UseGuards(JwtAuthGuard)
	@Get(':id')
	public async getUser(@Param('id') id: number): Promise<UserDto> {
		const user = await this.userService.findById(id, true);
		if (!user) {
			throw new NotFoundException(`User with id ${id} cannot be found`);
		}
		return plainToClass(UserDto, user, {
			excludeExtraneousValues: true,
		});
	}

	@AuthorizedApiOperation({ title: 'Update user endpoint' })
	@ApiOkResponse({ description: 'Update an user', type: UserDto })
	@NotFoundResponse('user')
	@UseGuards(JwtAuthGuard)
	@Put(':id')
	@Patch(':id')
	public async updateUser(
		@Param('id', new ParseIntPipe()) id: number,
		@Body() updateParams: Partial<CreateUserDto>,
		@CurrentUser() currentUser
	): Promise<UserDto> {
		if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
			throw new UnauthorizedException('You are not allowed to edit other users');
		}
		const user = await this.userService.findById(id, true);
		if (!user) {
			throw new NotFoundException(`User with id ${id} cannot be found`);
		}

		let updatedUser = await this.apiValidationService.validatePatch({
			originalValues: user,
			patch: updateParams,
			objectType: CreateUserDto,
		});

		updatedUser = await this.userService.save(updatedUser as User);

		return plainToClass(UserDto, updatedUser, {
			excludeExtraneousValues: true,
		});
	}
}
