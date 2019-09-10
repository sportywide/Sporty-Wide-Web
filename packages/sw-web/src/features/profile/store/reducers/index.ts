import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { createReducer, ActionType } from 'typesafe-actions';
import * as actions from '@web/features/profile/store/actions';

export type UserProfileAction = ActionType<typeof actions>;

export interface IUserProfile {
	basic?: UserDto;
}

export const userProfileReducer = createReducer<IUserProfile, UserProfileAction>({}).handleAction(
	actions.fetchBasicUserProfileSuccess,
	(state, action) => ({
		...state,
		basic: action.payload,
	})
);
