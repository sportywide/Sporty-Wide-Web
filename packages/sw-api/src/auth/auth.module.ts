import { Module } from '@nestjs/common';
import { AuthService } from '@api/auth/services/auth.service';
import { CryptoService } from '@api/auth/services/crypto.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@api/user/user.module';
import { AuthController } from '@api/auth/controllers/auth.controller';
import { JwtStrategy } from '@api/auth/strategy/jwt.strategy';
import { LocalStrategy } from '@api/auth/strategy/local.strategy';
import { SharedModule } from '@api/shared/shared.module';
import { CoreApiModule } from '@api/core/core-api.module';
import { EmailModule } from '@api/email/email.module';
import { API_CONFIG } from '@core/config/config.constants';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [CoreApiModule],
			inject: [API_CONFIG],
			useFactory: config => ({
				secret: config.get('jwt:secret_key'),
				signOptions: {
					expiresIn: config.get('jwt:expiration_time'),
				},
			}),
		}),
		UserModule,
		CoreApiModule,
		SharedModule,
		EmailModule,
	],
	controllers: [AuthController],
	providers: [AuthService, CryptoService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
