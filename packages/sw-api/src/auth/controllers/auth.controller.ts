import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService, Tokens } from '@api/auth/services/auth.service';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { LocalAuthGuard } from '@api/auth/guards/local.guard';
import { AuthenticatedGuard } from '@api/auth/guards/authenticated.guard';
import { RefreshTokenGuard } from '@api/auth/guards/refresh-token.guard';
import { EmailService } from '@api/email/email.service';
import { ApiCreatedResponse, ApiImplicitParam, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { AuthorizedApiOperation } from '@api/core/decorators/api-doc';
import { getValidationPipe } from '@api/core/pipe/validation';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private emailService: EmailService) {}

	@ApiCreatedResponse({ description: 'User has been created', type: Tokens })
	@ApiOperation({ title: 'Sign up endpoint' })
	@Post('signup')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(AuthenticatedGuard)
	public async signUp(@Body(getValidationPipe()) user: CreateUserDto, @Req() req, @Res() res) {
		const tokens = await this.authService.signUp(user);
		res.send(tokens);
	}

	@ApiImplicitParam({ name: 'username', type: String })
	@ApiImplicitParam({ name: 'password', type: String })
	@ApiOkResponse({ description: 'User has logged in successfully', type: Tokens })
	@ApiOperation({ title: 'Log in endpoint' })
	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthenticatedGuard, LocalAuthGuard)
	public async login(@Req() req, @Res() res) {
		const tokens = await this.authService.createTokens(req.user);
		res.send(tokens);
	}

	@ApiOkResponse({ description: 'A new refresh token has been created', type: Tokens })
	@AuthorizedApiOperation({ title: 'Refresh token endpoint' })
	@Post('refresh_token')
	@HttpCode(HttpStatus.OK)
	@UseGuards(RefreshTokenGuard)
	public async refreshToken(@Req() req, @Res() res) {
		const tokens = await this.authService.createTokens(req.user);
		res.send(tokens);
	}
}
