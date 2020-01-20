import React from 'react';
import { ReactReduxContext } from 'react-redux';
import { Reducer } from 'redux';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { isHotReload } from '@web/shared/lib/helpers/build';
import { ISportyWideStore } from '../store';
import { withContext } from '../context/providers';
import { ReducerManager } from './reducer-manager';

interface IProps {
	context: ReactReduxContext;
}

export function registerReducer(reducers: {
	[key: string]: Reducer<any, any> | { unmount: boolean; reducer: Reducer<any, any> };
}) {
	const reducerMap: Map<string, { unmount: boolean; reducer: Reducer<any, any> }> = new Map();
	return WrappedComponent => {
		class NewComponent extends React.Component<IProps> {
			reducerManager: ReducerManager;

			constructor(props) {
				super(props);
				const { store } = this.props.context;
				this.reducerManager = (store as ISportyWideStore).reducerManager;
				NewComponent.registerReducers(this.reducerManager);
			}

			static registerReducers(reducerManager: ReducerManager) {
				for (const [key, reducer] of Object.entries(reducers)) {
					let reducerFunction: Reducer<any, any>;
					if (typeof reducer === 'function') {
						reducerFunction = reducer;
					} else {
						reducerFunction = reducer.reducer;
					}
					reducerMap.set(key, {
						reducer: reducerFunction,
						unmount: typeof reducer === 'function' || reducer.unmount,
					});

					reducerManager.add(key, reducerFunction);
				}
			}

			render() {
				return <WrappedComponent {...this.props} />;
			}

			componentWillUnmount() {
				if (!isHotReload()) {
					for (const key of Object.keys(reducers)) {
						if (reducerMap.has(key)) {
							const mapping = reducerMap.get(key);
							if (mapping.unmount) {
								this.reducerManager.remove(key);
							}
						}
					}
				}
			}
		}

		hoistNonReactStatics(NewComponent, WrappedComponent);

		return withContext(ReactReduxContext)(NewComponent);
	};
}
