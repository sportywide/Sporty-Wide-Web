import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { plainToClass } from 'class-transformer';
import { User } from '@api/core/decorators/user';

@Controller('user')
export class Usercontroller {
	@UseGuards(JwtAuthGuard)
	@Get('me')
	public getCurrentUser(@User() user) {
		return plainToClass(UserDto, user.toJSON(), {
			excludeExtraneousValues: true,
		});
	}
}
