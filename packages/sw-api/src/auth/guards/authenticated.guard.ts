import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import passport from 'passport';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();

		return new Promise<boolean>(resolve => {
			passport.authenticate('jwt', function(err, user) {
				if (user) {
					resolve(false);
				} else {
					resolve(true);
				}
			})(request, response);
		});
	}
}