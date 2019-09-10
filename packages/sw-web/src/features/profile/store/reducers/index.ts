import { FETCH_BASIC_USER_PROFILE_SUCCESS } from '@web/features/profile/store/actions/actions.constants';
import { AnyAction } from 'redux';

interface IUserProfile {
	basic?: any;
}
export function userProfileReducer(state: IUserProfile = {}, { type, payload }: AnyAction): IUserProfile {
	switch (type) {
		case FETCH_BASIC_USER_PROFILE_SUCCESS:
			return {
				...state,
				basic: payload,
			};
		default:
			return state;
	}
}
