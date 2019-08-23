import { CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';

export class EnvGuard {
	static condition(fn): CanActivate {
		const shouldActivate = fn(process.env.NODE_ENV);
		return new (class implements CanActivate {
			canActivate(): boolean | Promise<boolean> | Observable<boolean> {
				return shouldActivate;
			}
		})();
	}

	static development() {
		return EnvGuard.condition(env => env !== 'production');
	}

	static production() {
		return EnvGuard.condition(env => env === 'production');
	}
}
