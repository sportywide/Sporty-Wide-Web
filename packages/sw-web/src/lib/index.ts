import { createStore, applyMiddleware, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createReducerManager, IReducerManager } from './reducer-manager';
import { fetchUserEpic } from '@web/features/home/store/epics';
import { reducer as characterReducer } from '@web/features/home/store/reducers';

export default function initStore(initialState) {
	const reducerManager = createReducerManager({});
	const epicMiddleware = createEpicMiddleware();
	const reduxMiddlewares = applyMiddleware(thunkMiddleware, epicMiddleware);
	const enhancers = process.env.NODE_ENV === 'development' ? composeWithDevTools(reduxMiddlewares) : reduxMiddlewares;
	const store: any = createStore(characterReducer, initialState, enhancers);
	store.reducerManager = reducerManager;
	epicMiddleware.run(combineEpics(fetchUserEpic));
	return store;
}

export interface SportyWideStore extends Store {
	reducerManager: IReducerManager;
}
