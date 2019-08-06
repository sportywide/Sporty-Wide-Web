import React from 'react';
import { ReactReduxContext } from 'react-redux';
import { AnyAction, Reducer } from 'redux';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { ISportyWideStore } from '../store';
import { withContext } from '../context/providers';
import { IReducerManager } from './reducer-manager';

interface IProps {
	context: ReactReduxContext;
}

export function registerReducer(reducers: { [key: string]: Reducer<any, AnyAction> }) {
	return WrappedComponent => {
		class NewComponent extends React.Component<IProps> {
			reducerManager: IReducerManager;

			constructor(props) {
				super(props);
				const { store } = this.props.context;
				this.reducerManager = (store as ISportyWideStore).reducerManager;
			}

			componentWillMount() {
				NewComponent.registerReducers(this.reducerManager);
			}

			static registerReducers(reducerManager: IReducerManager) {
				for (const [key, reducer] of Object.entries(reducers)) {
					reducerManager.add(key, reducer);
				}
			}

			render() {
				return <WrappedComponent {...this.props} />;
			}

			componentWillUnmount() {
				for (const key of Object.keys(reducers)) {
					this.reducerManager.remove(key);
				}
			}
		}

		hoistNonReactStatics(NewComponent, WrappedComponent);

		return withContext(ReactReduxContext)(NewComponent);
	};
}
