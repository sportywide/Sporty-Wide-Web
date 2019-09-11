import { ActionsObservable, combineEpics, StateObservable } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { AnyAction } from 'redux';

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
					return epic(action$, state$, dependencies);
				})
			),
	};
}
