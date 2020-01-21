import { catchAndThrow } from '@web/shared/lib/observable';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
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
	successAction: (
		action: PayloadAction<any, T>,
		result: R,
		state?
	) => PayloadAction<any, any> | PayloadAction<any, any>[];
	errorAction?: (action: PayloadAction<any, T>, error: Error) => PayloadAction<any, any>;
}) {
	return (action$, state$, { container }) => {
		return action$.ofType(actionType).pipe(
			mergeMap((action: PayloadAction<any, T>) => {
				return effect(action, container).pipe(
					mergeMap(data => {
						const returnValue = successAction(action, data, state$);
						if (!returnValue) {
							return EMPTY;
						}
						if (Array.isArray(returnValue)) {
							return of(...returnValue);
						} else {
							return of(returnValue);
						}
					}),
					catchAndThrow(error => {
						return errorAction(action, error);
					})
				);
			})
		);
	};
}
