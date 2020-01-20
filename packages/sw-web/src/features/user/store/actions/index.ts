import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import {
	USE_TOKENS,
	FETCH_MY_SCORE,
	FETCH_MY_SCORE_ERROR,
	FETCH_MY_SCORE_SUCCESS,
	RESET_MY_SCORE,
	SET_MY_SCORE,
} from '@web/features/user/store/actions/actions.constants';

export const fetchMyScore = createSwStandardAction(FETCH_MY_SCORE).map<any, number>(payload => ({
	payload,
	meta: {
		lifecycle: {
			resolve: FETCH_MY_SCORE_SUCCESS,
			reject: FETCH_MY_SCORE_ERROR,
		},
	},
}));
export const fetchMyScoreSuccess = createSwStandardAction(FETCH_MY_SCORE_SUCCESS)<{ tokens: number }>();
export const fetchMyScoreError = createSwStandardAction(FETCH_MY_SCORE_ERROR)<Error>();
export const setMyScore = createSwStandardAction(SET_MY_SCORE)<{ tokens: number }>();
export const resetMyScore = createSwStandardAction(RESET_MY_SCORE)();
export const useTokens = createSwStandardAction(USE_TOKENS)<number>();
