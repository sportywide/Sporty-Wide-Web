import { AnyAction } from 'redux';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { LOAD_AUTH, LOGOUT } from '@web/features/auth/store/actions/actions.constants';

export interface IAuthState {
	csrfToken?: string;
	user?: IUser;
}

const initialState: IAuthState = {};

export function authReducer(state: IAuthState = initialState, { type, payload }: AnyAction): IAuthState {
	switch (type) {
		case LOGOUT:
			return initialState;
		case LOAD_AUTH:
			return payload;
		default:
			return state;
	}
}
