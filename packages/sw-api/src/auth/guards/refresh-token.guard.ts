import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import passport from 'passport';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@api/user/services/user.service';
import { JwtStrategy } from '@api/auth/strategy/jwt.strategy';
import { TokenExpiredError } from 'jsonwebtoken';
import { COOKIE_REFRESH_TOKEN } from '@api/auth/constants';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly jwtStrategy: JwtStrategy
	) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();

		const refreshToken = request.cookies[COOKIE_REFRESH_TOKEN];
		if (!refreshToken) {
			return false;
		}

		return new Promise(resolve => {
			passport.authenticate('jwt', async (err, user, info) => {
				if (!(info && info.constructor === TokenExpiredError)) {
					return resolve(false);
				}
				const jwtToken = this.jwtStrategy.getToken(request);
				const decodedPayload = this.jwtService.decode(jwtToken);
				if (!decodedPayload) {
					return resolve(false);
				}
				const userId = decodedPayload.sub;
				user = await this.userService.findById(userId);
				if (!user || user.refreshToken !== refreshToken) {
					return resolve(false);
				}
				request.user = user;
				return resolve(true);
			})(request, response);
		});
	}
}
