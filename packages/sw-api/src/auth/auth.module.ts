import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { GoogleStrategy } from '@api/auth/strategy/google.strategy';
import { FacebookStrategy } from '@api/auth/strategy/facebook.strategy';
import { FacebookCallbackMiddleware } from '@api/auth/middlewares/facebook-callback.middleware';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [CoreApiModule],
			inject: [API_CONFIG],
			useFactory: config => ({
				secret: config.get('auth:jwt:secret_key'),
				signOptions: {
					expiresIn: config.get('auth:jwt:expiration_time'),
				},
			}),
		}),
		UserModule,
		CoreApiModule,
		SharedModule,
		EmailModule,
	],
	controllers: [AuthController],
	providers: [AuthService, CryptoService, JwtStrategy, LocalStrategy, GoogleStrategy, FacebookStrategy],
})
export class AuthModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(FacebookCallbackMiddleware)
			.forRoutes({ path: '/auth/facebook/callback', method: RequestMethod.GET });
	}
}
