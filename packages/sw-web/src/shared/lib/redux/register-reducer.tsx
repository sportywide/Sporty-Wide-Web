import React from 'react';
import { ReactReduxContext } from 'react-redux';
import { AnyAction, Reducer } from 'redux';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { isHotReload } from '@web/shared/lib/helpers/build';
import { ISportyWideStore } from '../store';
import { withContext } from '../context/providers';
import { ReducerManager } from './reducer-manager';

interface IProps {
	context: ReactReduxContext;
}

export function registerReducer(reducers: { [key: string]: Reducer<any, AnyAction> }) {
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
					reducerManager.add(key, reducer);
				}
			}

			render() {
				return <WrappedComponent {...this.props} />;
			}

			componentWillUnmount() {
				if (!isHotReload()) {
					for (const key of Object.keys(reducers)) {
						this.reducerManager.remove(key);
					}
				}
			}
		}

		hoistNonReactStatics(NewComponent, WrappedComponent);

		return withContext(ReactReduxContext)(NewComponent);
	};
}
