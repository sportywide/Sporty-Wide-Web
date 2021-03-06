import { LOGIN, LOGOUT, RESEND_VERIFICATION_EMAIL, SIGNUP } from '@web/features/auth/store/actions/actions.constants';
import { AuthService } from '@web/features/auth/services/auth.service';
import { mapTo, mergeMap, tap } from 'rxjs/operators';
import {
	loginSuccess,
	logoutSuccess,
	resendVerificationEmailSuccess,
	signupSuccess,
} from '@web/features/auth/store/actions';
import { IDependencies, ISportyWideStore } from '@web/shared/lib/store';
import { redirect } from '@web/shared/lib/navigation/helper';
import { success } from 'react-notification-system-redux';

export const logoutEpic = (action$, state$, { container }: IDependencies) => {
	return action$.ofType(LOGOUT).pipe(
		mergeMap(() => {
			const authService = container.get(AuthService);
			return authService.logout().pipe(
				mapTo(logoutSuccess),
				tap(async () => {
					await redirect({
						context: container.get('context'),
						route: 'login',
						replace: true,
						refresh: true,
					});
				})
			);
		})
	);
};

export const signupEpic = (action$, state$, { container }: IDependencies) => {
	return action$.ofType(SIGNUP).pipe(
		mergeMap(({ payload }) => {
			const authService = container.get(AuthService);
			return authService.signup(payload).pipe(
				mapTo(signupSuccess),
				tap(() => {
					redirect({
						refresh: true,
						replace: true,
					});
				})
			);
		})
	);
};

export const loginEpic = (action$, state$, { container }: IDependencies) => {
	return action$.ofType(LOGIN).pipe(
		mergeMap(({ payload }) => {
			const authService = container.get(AuthService);
			return authService.login(payload).pipe(
				mapTo(loginSuccess),
				tap(() => {
					redirect({
						refresh: true,
						replace: true,
					});
				})
			);
		})
	);
};

export const resendVerificationEpic = (action$, state$, { container }: IDependencies) => {
	return action$.ofType(RESEND_VERIFICATION_EMAIL).pipe(
		mergeMap(({ payload }) => {
			const authService = container.get(AuthService);
			const observable = authService.resendVerficationEmail(payload).pipe(mapTo(resendVerificationEmailSuccess));
			observable.subscribe(() => {
				const store: ISportyWideStore = container.get('store');
				store.dispatch(
					success({
						message: 'An email has been sent',
						title: 'Success',
					})
				);
			});
			return observable;
		})
	);
};
