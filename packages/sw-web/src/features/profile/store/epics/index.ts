import { of } from 'rxjs';
import { switchMap, map, mergeMap } from 'rxjs/operators';
import { FETCH_BASIC_USER_PROFILE, FETCH_USER_PROFILE } from '@web/features/profile/store/actions/actions.constants';
import { Container } from 'typedi';
import { UserService } from '@web/features/auth/services/user.service';
import {
	fetchBasicUserProfile,
	fetchBasicUserProfileSuccess,
	fetchExtraUserProfile,
} from '@web/features/profile/store/actions';

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
