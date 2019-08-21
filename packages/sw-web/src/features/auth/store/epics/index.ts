import { LOGOUT } from '@web/features/auth/store/actions/actions.constants';
import { AuthService } from '@web/features/auth/services/auth.service';
import { mergeMap, mapTo, tap } from 'rxjs/operators';
import { logoutSuccess } from '@web/features/auth/store/actions';
import { IDependencies } from '@web/shared/lib/store';

export const logoutEpic = (action$, state$, { container }: IDependencies) => {
	return action$.ofType(LOGOUT).pipe(
		mergeMap(() => {
			const authService = container.get(AuthService);
			return authService.logout().pipe(
				mapTo(logoutSuccess),
				tap(() => {
					window.location.href = '/';
				})
			);
		})
	);
};
