import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { UserProfileDto } from '@shared/lib/dtos/user/profile/user-profile.dto';
import {
	FETCH_BASIC_USER_PROFILE,
	FETCH_BASIC_USER_PROFILE_SUCCESS,
	FETCH_EXTRA_USER_PROFILE,
	FETCH_EXTRA_USER_PROFILE_SUCCESS,
	FETCH_USER_PROFILE,
	SAVE_BASIC_USER_PROFILE,
	SAVE_EXTRA_USER_PROFILE,
} from './actions.constants';

export const fetchBasicUserProfileSuccess = createSwStandardAction(FETCH_BASIC_USER_PROFILE_SUCCESS)<UserDto>();
export const fetchExtraUserProfileSuccess = createSwStandardAction(FETCH_EXTRA_USER_PROFILE_SUCCESS)<UserProfileDto>();
export const fetchUserProfile = createSwStandardAction(FETCH_USER_PROFILE)<number>();
export const fetchBasicUserProfile = createSwStandardAction(FETCH_BASIC_USER_PROFILE)<number>();
export const fetchExtraUserProfile = createSwStandardAction(FETCH_EXTRA_USER_PROFILE)<number>();
export const saveBasicUserProfile = createSwStandardAction(SAVE_BASIC_USER_PROFILE)<{
	id: number;
	profileData: CreateUserDto;
}>();

export const saveExtraUserProfile = createSwStandardAction(SAVE_EXTRA_USER_PROFILE)<{
	id: number;
	profileData: UserProfileDto;
}>();
