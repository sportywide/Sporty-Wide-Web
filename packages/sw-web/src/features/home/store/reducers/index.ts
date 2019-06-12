import { FETCH_CHARACTER_FAILURE, FETCH_CHARACTER_SUCCESS } from '@web/features/home/store/actions/actions.constants';
import { AnyAction } from 'redux';

export interface IHomeState {
	nextCharacterId: number;
	character: { name?: string; birth_year?: number; gender?: string; skin_color?: string; eye_color?: string };
	isFetchedOnServer: boolean;
	error: object | string | null;
}

const INITIAL_STATE: IHomeState = {
	nextCharacterId: 1,
	character: {},
	isFetchedOnServer: false,
	error: null,
};

export function reducer(state: IHomeState = INITIAL_STATE, { type, payload }: AnyAction): IHomeState {
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
