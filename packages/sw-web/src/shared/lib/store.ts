import { applyMiddleware, createStore, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicManager, IEpicManager } from '@web/shared/lib/redux/epic-manager';
import { isDevelopment } from '@shared/lib/utils/env';
import { parseContext } from '@web/shared/lib/auth/helper';
import { reducer as notifications } from 'react-notification-system-redux';
import { Container, ContainerInstance } from 'typedi';
import { authReducer } from '@web/features/auth/store/reducers';
import { logoutEpic } from '@web/features/auth/store/epics';
import React from 'react';
import { leagueReducer } from '@web/features/leagues/base/store/reducers/league-reducer';
import { fetchLeaguesEpic } from '@web/features/leagues/base/store/epics';
import { observableToPromiseMiddleware } from '@web/shared/lib/redux/middlewares/observable-to-promise';
import { createReducerManager, ReducerManager } from './redux/reducer-manager';

export interface IDependencies {
	container: ContainerInstance;
}

export const ContainerContext = React.createContext<ContainerInstance>(null as any);

export function initStore(initialState = {}, context) {
	if (context && context.store) {
		return context.store;
	}
	const auth = parseContext(context) || {};

	const container = registerContainer({ context });
	const initialReducers = getInitialReducers(initialState, {
		auth: authReducer,
		notifications,
		loadingBar: loadingBarReducer,
		leagues: leagueReducer,
	});
	const reducerManager = createReducerManager(initialReducers);
	const epicMiddleware = createEpicMiddleware({
		dependencies: { container },
	});
	const reduxMiddleware = applyMiddleware(
		thunkMiddleware.withExtraArgument({ container }),
		observableToPromiseMiddleware,
		epicMiddleware
	);
	const epicManager = createEpicManager(logoutEpic, fetchLeaguesEpic);
	const enhancers = isDevelopment() ? composeWithDevTools({ serialize: true })(reduxMiddleware) : reduxMiddleware;
	const store = createStore(reducerManager.reduce, { ...initialState, auth }, enhancers) as ISportyWideStore;
	store.reducerManager = reducerManager;
	reducerManager.store = store;
	store.epicManager = epicManager;
	store.container = container;
	container.set('store', store);
	epicMiddleware.run(epicManager.rootEpic);
	return store;
}

export interface ISportyWideStore extends Store {
	reducerManager: ReducerManager;
	epicManager: IEpicManager;
	container: ContainerInstance;
}

export function getUser(store) {
	const state = store.getState();
	return state.auth && state.auth.user;
}

function registerContainer({ context }) {
	const appContainer = Container.of(context.req);
	appContainer.set('context', context);
	if (context.req) {
		appContainer.set('baseUrl', `${isDevelopment() ? context.req.protocol : 'https'}://${context.req.get('host')}`);
	} else {
		appContainer.set('baseUrl', window.location.origin);
	}
	return appContainer;
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
