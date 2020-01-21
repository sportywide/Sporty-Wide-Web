import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '@api/auth/strategy/jwt.strategy';
import { getRequest } from '@api/utils/context';
import { bugsnagClient } from '@api/utils/bugsnag';
import { UserService } from '@api/user/services/user.service';
import { TokenService } from '@api/auth/services/token.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly tokenService: TokenService,
		private readonly userService: UserService,
		private readonly jwtStrategy: JwtStrategy
	) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = getRequest(context);
		const refreshToken = this.jwtStrategy.getRefreshToken(request);
		if (!refreshToken) {
			return false;
		}

		return new Promise(async resolve => {
			let [userId]: any[] = refreshToken.split(':');
			userId = parseInt(userId, 10);
			if (isNaN(userId)) {
				return resolve(false);
			}
			const user = await this.userService.findById({ id: userId });
			if (!user) {
				return resolve(false);
			}
			const storedRefreshToken = await this.tokenService.getRefreshToken(userId);
			if (storedRefreshToken !== refreshToken) {
				return resolve(false);
			}
			request.user = user;
			bugsnagClient.user = user.getBugsnagData();
			return resolve(true);
		});
	}
}
