import { Module } from '@nestjs/common';
import { AuthService } from '@api/auth/services/auth.service';
import { CryptoService } from '@api/auth/services/crypto.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import config from '@api/config';
import { UserModule } from '@api/user/user.module';
import { AuthController } from '@api/auth/controllers/auth.controller';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secretOrPrivateKey: config.get('jwt:secret_key'),
			signOptions: {
				expiresIn: config.get('jwt:expiration_time'),
			},
		}),
		UserModule,
	],
	controllers: [AuthController],
	providers: [AuthService, CryptoService],
})
export class AuthModule {}
