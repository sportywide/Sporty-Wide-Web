import { autobind } from 'core-decorators';
import { combineReducers, Store } from 'redux';

export class ReducerManager {
	reducers: {};
	store: Store;
	combinedReducers: any;
	keysToRemove: string[];

	constructor(initialReducers = {}) {
		this.reducers = { ...initialReducers };
		this.combinedReducers = this.syncReducers();
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
		if (!key) {
			return;
		}
		if (this.reducers[key] === reducer) {
			return;
		}
		this.reducers[key] = reducer;
		this.combinedReducers = this.syncReducers();
		this.store.dispatch({
			type: '@@ADD_REDUCER',
		});
	}

	@autobind
	remove(key) {
		if (!key || !this.reducers[key]) {
			return;
		}
		delete this.reducers[key];
		this.keysToRemove.push(key);
		this.combinedReducers = this.syncReducers();
		this.store.dispatch({
			type: '@@REMOVE_REDUCER',
		});
	}

	private syncReducers() {
		return Object.keys(this.reducers).length ? combineReducers(this.reducers) : state => state;
	}
}

export function createReducerManager(initialReducers) {
	return new ReducerManager(initialReducers);
}
