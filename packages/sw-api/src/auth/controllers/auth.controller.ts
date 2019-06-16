import { Controller, Body, Post, HttpStatus, Req, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from '@api/auth/services/auth.service';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthGuard } from '@api/auth/guards/local.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

	@Post('signup')
	public async signUp(@Body() user: CreateUserDto) {
		return await this.authService.signUp(user);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	public async login(@Req() req) {
		return await this.jwtService.sign(req.user);
	}
}
