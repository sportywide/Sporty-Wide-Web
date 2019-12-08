import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import passport from 'passport';

@Injectable()
export class FacebookCallbackMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: Function) {
		const referrer = req.get('Referer') || '';
		const failureUrl = `${referrer}/login`;
		passport.authenticate('facebook', {
			failureRedirect: failureUrl,
			callbackURL: `${referrer}/auth/facebook/callback`,
			session: false,
		})(req, res, next);
	}
}
