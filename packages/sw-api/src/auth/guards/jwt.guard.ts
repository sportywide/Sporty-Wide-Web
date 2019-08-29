import { ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { CHECK_METADATA, CheckFunction } from '@api/auth/decorators/user-check.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private readonly reflector: Reflector) {
		super();
	}

	handleRequest(err, user, info, context: ExecutionContext) {
		let message;
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
		const checkFunction = this.reflector.get<CheckFunction>(CHECK_METADATA, context.getHandler());
		if (checkFunction && !checkFunction(user)) {
			throw new ForbiddenException('You are not allowed to access this endpoint');
		}
		return user;
	}
}
