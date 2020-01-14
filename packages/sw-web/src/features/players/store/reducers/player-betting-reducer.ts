import { ProfilePlayersAction } from '@web/features/players/store/reducers/profile-player-reducer';
import { createReducer } from 'typesafe-actions';
import produce from 'immer';
import { keyBy } from 'lodash';
import { setObjectKey } from '@shared/lib/utils/object/set';
import * as actions from '../actions';

const initialState = {};

export const playerBettingReducer = produce(
	createReducer<any, ProfilePlayersAction>(initialState)
		.handleAction(actions.fetchMyBettingSuccess, (state, { payload }) => {
			const currentDate = new Date();
			const betting = payload.betting
				.filter(betting => betting.betRating != undefined || new Date(betting.fixture.time) > currentDate)
				.map(betting => ({
					...betting,
					newBetRating: betting.betRating,
				}));
			setObjectKey(state, `[${payload.userId}][${payload.leagueId}].players`, keyBy(betting, 'playerId'));
			return state;
		})
		.handleAction(actions.updateRating, (state, { payload }) => {
			setObjectKey(
				state,
				`[${payload.userId}][${payload.leagueId}].players[${payload.playerId}].newBetRating`,
				parseFloat(payload.rating as any)
			);
			return state;
		})
		.handleAction(actions.updateToken, (state, { payload }) => {
			setObjectKey(
				state,
				`[${payload.userId}][${payload.leagueId}].players[${payload.playerId}].newBetTokens`,
				payload.token
			);
			return state;
		})
);
