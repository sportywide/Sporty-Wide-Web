import { createStandardEpic } from '@web/shared/lib/redux/epic';
import { FETCH_MY_SCORE } from '@web/features/user/store/actions/actions.constants';
import { fetchMyScoreError, fetchMyScoreSuccess, setMyScore } from '@web/features/user/store/actions';
import { UserScoreDto } from '@shared/lib/dtos/user/user-score.dto';
import { UserScoreService } from '@web/features/user/services/user-score.service';
import { getUser } from '@web/shared/lib/store';

export const fetchMyUserScoreEpic = createStandardEpic<number, UserScoreDto>({
	actionType: FETCH_MY_SCORE,
	successAction: (action, data) => [
		setMyScore({ tokens: data.tokens }),
		fetchMyScoreSuccess({ tokens: data.tokens }),
	],
	errorAction: (action, error) => fetchMyScoreError(error),
	effect: ({ payload: leagueId }, container) => {
		const store = container.get('store');
		const user = getUser(store);
		const playerBettingService = container.get(UserScoreService);
		return playerBettingService.fetchUserScore({ userId: user.id, leagueId });
	},
});
