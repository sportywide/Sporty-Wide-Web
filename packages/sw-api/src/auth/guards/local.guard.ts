import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getRequest } from '@api/utils/context';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
	getRequest(context: ExecutionContext) {
		return getRequest(context);
	}

	handleRequest(err, user, info) {
		if (info) {
			throw new UnauthorizedException(info.message);
		} else if (err || !user) {
			throw err || new UnauthorizedException();
		}
		return user;
	}
}
