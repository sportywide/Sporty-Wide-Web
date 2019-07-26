import { Store, applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import { IEpicManager, createEpicManager } from '@web/shared/lib/redux/epic-manager';
import { IReducerManager, createReducerManager } from './redux/reducer-manager';

export function initStore(initialState) {
	const reducerManager = createReducerManager({});
	const epicManager = createEpicManager();
	const epicMiddleware = createEpicMiddleware();
	const reduxMiddlewares = applyMiddleware(thunkMiddleware, epicMiddleware);
	const enhancers = process.env.NODE_ENV === 'development' ? composeWithDevTools(reduxMiddlewares) : reduxMiddlewares;
	const store = createStore(reducerManager.reduce, initialState, enhancers) as ISportyWideStore;
	store.reducerManager = reducerManager;
	store.epicManager = epicManager;
	epicMiddleware.run(epicManager.rootEpic);
	return store;
}

export interface ISportyWideStore extends Store {
	reducerManager: IReducerManager;
	epicManager: IEpicManager;
}
