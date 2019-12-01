import { catchAndThrow } from '@web/shared/lib/observable';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { PayloadAction } from 'typesafe-actions';
import { ContainerInstance } from 'typedi';
import { noop } from '@shared/lib/utils/functions';

export function createStandardEpic<T, R>({
	actionType,
	effect,
	successAction,
	errorAction = noop,
}: {
	actionType: symbol | string;
	effect: (action: PayloadAction<any, T>, container: ContainerInstance) => Observable<R>;
	successAction: (action: PayloadAction<any, T>, result: R) => PayloadAction<any, any>;
	errorAction?: (action: PayloadAction<any, T>, error: Error) => PayloadAction<any, any>;
}) {
	return (action$, state$, { container }) => {
		return action$.ofType(actionType).pipe(
			mergeMap((action: PayloadAction<any, T>) => {
				return effect(action, container).pipe(
					map(data => successAction(action, data)),
					catchAndThrow(error => errorAction(action, error))
				);
			})
		);
	};
}
