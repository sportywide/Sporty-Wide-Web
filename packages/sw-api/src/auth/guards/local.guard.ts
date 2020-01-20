import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getRequest } from '@api/utils/context';
import { bugsnagClient } from '@api/utils/bugsnag';

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
		bugsnagClient.user = user.getBugsnagData();
		return user;
	}
}
