import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	handleRequest(err, user, info) {
		let message;
		if (user) {
			return user;
		}
		if (err) {
			throw err;
		} else if (info) {
			if (info.constructor === JsonWebTokenError) {
				message = 'You must provide a valid authenticated access token';
			} else if (info.constructor === TokenExpiredError) {
				message = 'Your token has expired';
			} else {
				message = info.message;
			}
			throw new UnauthorizedException(message);
		}
		return user;
	}
}
