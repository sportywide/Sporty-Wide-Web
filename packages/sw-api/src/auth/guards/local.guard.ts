import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
	canActivate(context: ExecutionContext) {
		return super.canActivate(context);
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
