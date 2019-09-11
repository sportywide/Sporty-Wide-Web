import { of } from 'rxjs';
import { switchMap, map, mergeMap } from 'rxjs/operators';
import {
	FETCH_BASIC_USER_PROFILE,
	FETCH_USER_PROFILE,
	SAVE_BASIC_USER_PROFILE,
} from '@web/features/profile/store/actions/actions.constants';
import { Container } from 'typedi';
import { UserService } from '@web/features/user/services/user.service';
import {
	fetchBasicUserProfile,
	fetchBasicUserProfileSuccess,
	fetchExtraUserProfile,
	saveBasicUserProfile,
} from '@web/features/profile/store/actions';
import { success } from 'react-notification-system-redux';
import { ActionType } from 'typesafe-actions';

export const fetchUserProfileEpic = action$ => {
	return action$.ofType(FETCH_USER_PROFILE).pipe(
		mergeMap((action: any) => {
			return of(fetchBasicUserProfile(action.payload), fetchExtraUserProfile(action.payload));
		})
	);
};

export const fetchBasicUserProfileEpic = (action$, state$, { container }: { container: typeof Container }) => {
	const userService = container.get(UserService);
	return action$
		.ofType(FETCH_BASIC_USER_PROFILE)
		.pipe(
			switchMap((action: any) =>
				userService.getBasicProfile(action.payload).pipe(map(fetchBasicUserProfileSuccess))
			)
		);
};

export const saveBasicUserProfileEpic = (action$, state$, { container }: { container: typeof Container }) => {
	const userService = container.get(UserService);
	return action$.ofType(SAVE_BASIC_USER_PROFILE).pipe(
		switchMap((action: ActionType<typeof saveBasicUserProfile>) =>
			userService.saveBasicProfile(action.payload.id, action.payload.profileData).pipe(
				mergeMap(() =>
					of(
						fetchBasicUserProfile(action.payload.id),
						success({
							title: 'Success',
							message: 'Your profile has been updated',
						})
					)
				)
			)
		)
	);
};
