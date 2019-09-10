import {
	FETCH_BASIC_USER_PROFILE,
	FETCH_BASIC_USER_PROFILE_SUCCESS,
	FETCH_EXTRA_USER_PROFILE,
	FETCH_EXTRA_USER_PROFILE_SUCCESS,
	FETCH_USER_PROFILE,
} from './actions.constants';

export const fetchBasicUserProfileSuccess = basicProfile => ({
	type: FETCH_BASIC_USER_PROFILE_SUCCESS,
	payload: basicProfile,
});

export const fetchExtraUserProfileSuccess = extraProfile => ({
	type: FETCH_EXTRA_USER_PROFILE_SUCCESS,
	payload: extraProfile,
});

export const fetchUserProfile = userId => ({
	type: FETCH_USER_PROFILE,
	payload: userId,
});

export const fetchBasicUserProfile = userId => ({
	type: FETCH_BASIC_USER_PROFILE,
	payload: userId,
});

export const fetchExtraUserProfile = userId => ({
	type: FETCH_EXTRA_USER_PROFILE,
	payload: userId,
});
