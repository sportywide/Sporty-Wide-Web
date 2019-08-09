import { autobind } from 'core-decorators';
import { combineReducers } from 'redux';

export class ReducerManager {
	reducers: {};
	combinedReducers: any;
	keysToRemove: string[];

	constructor(initialReducers = {}) {
		this.reducers = { ...initialReducers };
		this.combinedReducers = Object.keys(this.reducers).length ? combineReducers(this.reducers) : state => state;
		this.keysToRemove = [];
	}

	@autobind
	reduce(state, action) {
		if (this.keysToRemove.length > 0) {
			state = { ...state };
			for (const key of this.keysToRemove) {
				delete state[key];
			}
			this.keysToRemove = [];
		}

		return this.combinedReducers(state, action);
	}

	@autobind
	add(key, reducer) {
		if (!key || this.reducers[key]) {
			return;
		}
		this.reducers[key] = reducer;
		this.combinedReducers = combineReducers(this.reducers);
	}

	@autobind
	remove(key) {
		if (!key || !this.reducers[key]) {
			return;
		}
		delete this.reducers[key];
		this.keysToRemove.push(key);
		this.combinedReducers = combineReducers(this.reducers);
	}
}

export function createReducerManager(initialReducers) {
	return new ReducerManager(initialReducers);
}
