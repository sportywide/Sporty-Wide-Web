import {
	FETCH_CHARACTER_FAILURE,
	FETCH_CHARACTER_SUCCESS,
	START_FETCHING_CHARACTERS,
	STOP_FETCHING_CHARACTERS,
} from './actions.constants';

export const startFetchingCharacters = () => ({ type: START_FETCHING_CHARACTERS });
export const stopFetchingCharacters = () => ({ type: STOP_FETCHING_CHARACTERS });
export const fetchCharacterSuccess = (response, isServer) => ({
	type: FETCH_CHARACTER_SUCCESS,
	payload: { response, isServer },
});

export const fetchCharacterFailure = (error, isServer) => ({
	type: FETCH_CHARACTER_FAILURE,
	payload: { error, isServer },
});
