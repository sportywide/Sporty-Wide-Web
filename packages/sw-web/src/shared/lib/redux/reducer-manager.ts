import { combineReducers } from 'redux';
import { AnyAction, Reducer } from 'redux';

export interface IReducerManager {
	getReducerMap: Function;
	reduce: Reducer<any, AnyAction>;
	add: (key: string, reducer: Reducer<any, AnyAction>) => void;
	remove: (key: string) => void;
}
export function createReducerManager(initialReducers = {}): IReducerManager {
	const reducers = { ...initialReducers };

	// Create the initial combinedReducer
	let combinedReducer = Object.keys(reducers).length ? combineReducers(reducers) : state => state;

	let keysToRemove: string[] = [];

	return {
		getReducerMap: () => reducers,

		reduce: (state, action) => {
			if (keysToRemove.length > 0) {
				state = { ...state };
				for (const key of keysToRemove) {
					delete state[key];
				}
				keysToRemove = [];
			}

			return combinedReducer(state, action);
		},

		add: (key, reducer) => {
			if (!key || reducers[key]) {
				return;
			}
			reducers[key] = reducer;
			combinedReducer = combineReducers(reducers);
		},

		remove: key => {
			if (!key || !reducers[key]) {
				return;
			}
			delete reducers[key];
			keysToRemove.push(key);
			combinedReducer = combineReducers(reducers);
		},
	};
}
