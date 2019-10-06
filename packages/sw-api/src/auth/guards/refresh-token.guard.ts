import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import passport from 'passport';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@api/user/services/user.service';
import { JwtStrategy } from '@api/auth/strategy/jwt.strategy';
import { TokenExpiredError } from 'jsonwebtoken';
import { getRequest } from '@api/utils/context';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly jwtStrategy: JwtStrategy
	) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = getRequest(context);
		const refreshToken = this.jwtStrategy.getRefreshToken(request);
		if (!refreshToken) {
			return false;
		}

		return new Promise(resolve => {
			passport.authenticate('jwt', async (err, user, info) => {
				if (!(info && info.constructor === TokenExpiredError)) {
					return resolve(false);
				}
				const jwtToken = this.jwtStrategy.getToken(request);
				const decodedPayload: any = this.jwtService.decode(jwtToken);
				if (!(decodedPayload && decodedPayload.user)) {
					return resolve(false);
				}
				const userId = decodedPayload.user.id;
				user = await this.userService.findById({ id: userId });
				if (!user || user.refreshToken !== refreshToken) {
					return resolve(false);
				}
				request.user = user;
				return resolve(true);
			})(request);
		});
	}
}
