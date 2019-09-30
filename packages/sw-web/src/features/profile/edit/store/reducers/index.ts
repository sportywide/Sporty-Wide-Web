import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { ActionType, createReducer } from 'typesafe-actions';
import * as actions from '@web/features/profile/edit/store/actions';
import { UserProfileDto } from '@shared/lib/dtos/user/profile/user-profile.dto';

export type UserProfileAction = ActionType<typeof actions>;

export interface IUserProfile {
	basic: UserDto;
	extra: UserProfileDto;
}

export const userProfileReducer = createReducer<IUserProfile, UserProfileAction>({
	basic: null as any,
	extra: null as any,
})
	.handleAction(actions.fetchBasicUserProfileSuccess, (state, action) => ({
		...state,
		basic: action.payload,
	}))
	.handleAction(actions.fetchExtraUserProfileSuccess, (state, action) => ({
		...state,
		extra: action.payload,
	}));
