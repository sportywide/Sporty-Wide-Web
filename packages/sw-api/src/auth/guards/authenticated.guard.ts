import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import passport from 'passport';
import { getRequest } from '@api/utils/context';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = getRequest(context);

		return new Promise<boolean>(resolve => {
			passport.authenticate('jwt', function(err, user) {
				if (user) {
					resolve(false);
				} else {
					resolve(true);
				}
			})(request);
		});
	}
}
