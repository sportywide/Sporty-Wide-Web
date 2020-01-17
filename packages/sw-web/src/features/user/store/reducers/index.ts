import * as actions from '@web/features/user/store/actions';
import { ActionType } from 'typesafe-actions';
import { createReducer } from '@web/shared/lib/redux/action-creators';

export type UserScoreAction = ActionType<typeof actions>;

export interface IUserScoreState {
	current: {
		tokens?: number;
	};
	saved: {
		tokens?: number;
	};
}

export const userScoreReducer = createReducer<IUserScoreState, UserScoreAction>({
	current: {},
	saved: {},
})
	.handleAction(actions.setMyScore, (state, { payload }) => ({
		...state,
		current: {
			tokens: payload.tokens,
		},
		saved: {
			tokens: payload.tokens,
		},
	}))
	.handleAction(actions.useTokens, (state, { payload: tokens }) => ({
		...state,
		current: {
			tokens: state.saved.tokens > tokens ? state.saved.tokens - tokens : 0,
		},
	}))
	.handleAction(actions.resetMyScore, state => ({
		...state,
		current: {
			tokens: state.saved.tokens,
		},
	}));
