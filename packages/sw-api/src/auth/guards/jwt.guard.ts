import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	handleRequest(err, user, info) {
		let message;
		if (err) {
			throw err;
		} else if (typeof info != 'undefined' || !user) {
			switch (info.message) {
				case 'No auth token':
				case 'jwt malformed':
				case 'invalid token':
				case 'invalid signature':
					message = 'You must provide a valid authenticated access token';
					break;
				case 'jwt expired':
					message = 'Your session has expired';
					break;
				default:
					message = info.message;
					break;
			}
			throw new UnauthorizedException(message);
		}
		return user;
	}
}
