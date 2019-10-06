import { IUser } from '@web/shared/lib/interfaces/auth/user';
import * as actions from '@web/features/auth/store/actions';
import { ActionType, createReducer } from 'typesafe-actions';

export interface IAuthState {
	csrfToken?: string;
	user?: IUser;
}

export type AuthAction = ActionType<typeof actions>;

const initialState: IAuthState = {};

export const authReducer = createReducer<IAuthState, AuthAction>(initialState)
	.handleAction(actions.setAuth, (state, { payload = {} }) => ({ ...state, ...payload }))
	.handleAction(actions.logoutSuccess, () => initialState);
