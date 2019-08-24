import { applyMiddleware, createStore, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicManager, IEpicManager } from '@web/shared/lib/redux/epic-manager';
import { isDevelopment } from '@shared/lib/utils/env';
import { parseCookies } from '@web/shared/lib/auth/helper';
import { Container } from 'typedi';
import { authReducer } from '@web/features/auth/store/reducers';
import { logoutEpic } from '@web/features/auth/store/epics';
import React from 'react';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { createReducerManager, ReducerManager } from './redux/reducer-manager';

export interface IDependencies {
	container: typeof Container;
}

export function initStore(initialState = {}, context) {
	if (context && context.store) {
		return context.store;
	}
	const auth = parseCookies(context) || {};

	const container = registerContainer({ auth });
	const initialReducers = getInitialReducers(initialState, {
		auth: authReducer,
	});
	const reducerManager = createReducerManager(initialReducers);
	const epicMiddleware = createEpicMiddleware({
		dependencies: { container },
	});
	const reduxMiddleware = applyMiddleware(thunkMiddleware.withExtraArgument({ container }), epicMiddleware);
	const epicManager = createEpicManager(logoutEpic);
	const enhancers = isDevelopment() ? composeWithDevTools(reduxMiddleware) : reduxMiddleware;
	const store = createStore(reducerManager.reduce, { ...initialState, auth }, enhancers) as ISportyWideStore;
	store.reducerManager = reducerManager;
	store.epicManager = epicManager;
	store.container = container;
	epicMiddleware.run(epicManager.rootEpic);
	return store;
}

export const ContainerContext = React.createContext(Container);

export const UserContext = React.createContext<IUser>(null);

export interface ISportyWideStore extends Store {
	reducerManager: ReducerManager;
	epicManager: IEpicManager;
	container: typeof Container;
}

function registerContainer({ auth }) {
	const user = auth.user;
	const csrfToken = auth.csrfToken;
	Container.set('currentUser', user || null);
	Container.set('csrfToken', csrfToken || null);
	return Container;
}

function getInitialReducers(initialState, initialReducer) {
	if (!initialState) {
		return initialReducer;
	}

	const reducers = { ...initialReducer };

	Object.keys(initialState).forEach(stateKey => {
		if (!reducers[stateKey]) {
			reducers[stateKey] = () => initialState[stateKey];
		}
	});

	return reducers;
}
