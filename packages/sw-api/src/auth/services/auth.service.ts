import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { CryptoService } from '@api/auth/services/crypto.service';
import { UserService } from '@api/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@schema/user/models/user.entity';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly cryptoService: CryptoService,
		private readonly jwtService: JwtService
	) {}

	public async signUp(createUserDto: CreateUserDto) {
		createUserDto['role'] = UserRole.USER;
		createUserDto['status'] = UserStatus.PENDING;
		const user = await this.userService.create(createUserDto);
		return this.jwtSign(user);
	}

	public jwtSign(user: User) {
		const id = user.get('id') || user.id;
		return this.jwtService.sign({
			sub: id,
			user: {
				id,
				email: user.get('email'),
				firstName: user.get('firstName'),
				lastName: user.get('lastName'),
			},
		});
	}

	public async logIn(email, password) {
		const user = await this.userService.findOne({ where: { email } });
		if (!user) {
			throw new NotFoundException(`User with email ${email} cannot be found`);
		}
		if (!CryptoService.comparePassword(password, user.get('password'))) {
			throw new BadRequestException('Incorrect password');
		}
		return user;
	}

	public async verify(payload) {
		const user = await this.userService.findOne({ where: { id: payload.sub } });
		if (!user) {
			throw new UnauthorizedException('Invalid token');
		}
		return user;
	}
}
