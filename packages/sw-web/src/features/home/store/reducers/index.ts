import { FETCH_CHARACTER_FAILURE, FETCH_CHARACTER_SUCCESS } from '@web/features/home/store/actions/actions.constants';

const INITIAL_STATE = {
	nextCharacterId: 1,
	character: {},
	isFetchedOnServer: false,
	error: null,
};

export function reducer(state = INITIAL_STATE, { type, payload }) {
	switch (type) {
		case FETCH_CHARACTER_SUCCESS:
			return {
				...state,
				character: payload.response,
				isFetchedOnServer: payload.isServer,
				nextCharacterId: state.nextCharacterId + 1,
			};
		case FETCH_CHARACTER_FAILURE:
			return { ...state, error: payload.error, isFetchedOnServer: payload.isServer };
		default:
			return state;
	}
}
