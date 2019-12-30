import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { CHECK_METADATA, CheckFunction } from '@api/auth/decorators/user-check.decorator';
import { getRequest } from '@api/utils/context';
import { bugsnagClient } from '@api/utils/bugsnag';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private readonly reflector: Reflector) {
		super();
	}

	getRequest(context: ExecutionContext) {
		return getRequest(context);
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
		bugsnagClient.user = user.getBugsnagData();
		return user;
	}
}
