import { interval } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import {
	START_FETCHING_CHARACTERS,
	STOP_FETCHING_CHARACTERS,
} from '@web/features/home/store/actions/actions.constants';
import { fetchCharacter } from '@web/features/home/services/character.service';

export const fetchUserEpic = (action$, state$) => {
	return action$.ofType(START_FETCHING_CHARACTERS).pipe(
		mergeMap(() =>
			interval(3000).pipe(
				mergeMap(() => fetchCharacter(state$.value.nextCharacterId)),
				takeUntil(action$.ofType(STOP_FETCHING_CHARACTERS))
			)
		)
	);
};
