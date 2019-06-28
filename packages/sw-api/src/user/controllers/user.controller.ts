import { Controller, Get, HttpStatus, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { plainToClass } from 'class-transformer';
import { User } from '@api/core/decorators/user';
import { UserService } from '@api/user/services/user.service';
import { ApiOkResponse, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AuthorizedApiOperation } from '@api/core/decorators/api-doc';

@ApiUseTags('users')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@AuthorizedApiOperation({ title: 'Get current user endpoint' })
	@ApiOkResponse({ description: 'Return the currently authenticated user', type: UserDto })
	@UseGuards(JwtAuthGuard)
	@Get('me')
	public getCurrentUser(@User() user): UserDto {
		return plainToClass(UserDto, user.toJSON(), {
			excludeExtraneousValues: true,
		});
	}

	@AuthorizedApiOperation({ title: 'Get user endpoint' })
	@ApiOkResponse({ description: 'Return the user with specified id', type: UserDto })
	@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User with id specified cannot be found' })
	@UseGuards(JwtAuthGuard)
	@Get(':id')
	public async getUser(@Param('id') id: number): Promise<UserDto> {
		const user = await this.userService.findById(id);
		if (!user) {
			throw new NotFoundException(`User with id ${id} cannot be found`);
		}
		return plainToClass(UserDto, user.toJSON(), {
			excludeExtraneousValues: true,
		});
	}
}
