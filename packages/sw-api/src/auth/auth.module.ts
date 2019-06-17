import { Module } from '@nestjs/common';
import { AuthService } from '@api/auth/services/auth.service';
import { CryptoService } from '@api/auth/services/crypto.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import config from '@api/config';
import { UserModule } from '@api/user/user.module';
import { AuthController } from '@api/auth/controllers/auth.controller';
import { JwtStrategy } from '@api/auth/strategy/jwt.strategy';
import { LocalStrategy } from '@api/auth/strategy/local.strategy';
import { SharedModule } from '@api/shared/shared.module';
import { CoreModule } from '@api/core/core.module';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secret: config.get('jwt:secret_key'),
			signOptions: {
				expiresIn: config.get('jwt:expiration_time'),
			},
		}),
		UserModule,
		CoreModule,
		SharedModule,
	],
	controllers: [AuthController],
	providers: [AuthService, CryptoService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
