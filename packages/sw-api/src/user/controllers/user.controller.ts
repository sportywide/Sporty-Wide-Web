import { Controller, Get, UseGuards, Param, NotFoundException } from '@nestjs/common';
import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { plainToClass } from 'class-transformer';
import { User } from '@api/core/decorators/user';
import { UserService } from '@api/user/services/user.service';

@Controller('user')
export class Usercontroller {
	constructor(private readonly userService: UserService) {}
	@UseGuards(JwtAuthGuard)
	@Get('me')
	public getCurrentUser(@User() user) {
		return plainToClass(UserDto, user.toJSON(), {
			excludeExtraneousValues: true,
		});
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	public async getUser(@Param('id') id) {
		const user = await this.userService.findById(id);
		if (!user) {
			throw new NotFoundException(`User with id ${id} cannot be found`);
		}
		return plainToClass(UserDto, user.toJSON(), {
			excludeExtraneousValues: true,
		});
	}
}
