import { ActionsObservable, combineEpics, StateObservable } from 'redux-observable';
import { catchError, mergeMap } from 'rxjs/operators';
import { BehaviorSubject, EMPTY, merge, Observable, of } from 'rxjs';
import { AnyAction } from 'redux';
import { epicError } from '@web/shared/lib/redux/core.actions';
import { safeGet } from '@shared/lib/utils/object/get';
import { isBrowser } from '@web/shared/lib/environment';
import { logger } from '@web/shared/lib/logging';
import { RethrowError } from '@shared/lib/utils/error';

export interface IEpicManager {
	add: (...epics: any[]) => void;
	rootEpic: (action$: ActionsObservable<AnyAction>, state$: StateObservable<any>, dependencies) => Observable<any>;
}

export function createEpicManager(...initialEpics): IEpicManager {
	const epic$ = new BehaviorSubject(initialEpics.length ? combineEpics(...initialEpics) : null);
	const epicSet = new Set();

	return {
		add(...epics) {
			for (const epic of epics) {
				if (epicSet.has(epic)) {
					return;
				}
				epicSet.add(epic);
				epic$.next(epic);
			}
		},
		rootEpic: (action$, state$, dependencies) =>
			epic$.pipe(
				mergeMap(epic => {
					if (!epic) {
						return EMPTY;
					}
					return epic(action$, state$, dependencies).pipe(
						catchError((error, source) => {
							setTimeout(() => {
								//http error
								const statusCode = safeGet(() => error.response.status);
								// we dont want to capture 4xx errors
								if (!statusCode || statusCode >= 500) {
									const rethrownError = new RethrowError('Error in root Epic', error);
									if (isBrowser()) {
										throw rethrownError;
									} else {
										logger.error(rethrownError);
									}
								}
							}, 0);
							return merge(source, of(epicError(error)));
						})
					);
				})
			),
	};
}
