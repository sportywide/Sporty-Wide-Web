import React from 'react';
import { ReactReduxContext } from 'react-redux';
import { SportyWideStore } from '@web/lib';
import { Reducer, AnyAction } from 'redux';
import { IReducerManager } from '@web/lib/reducer-manager';
import { withContext } from '../context/providers';

interface IProps {
	context: ReactReduxContext;
}

export function registerReducer(reducers: { [key: string]: Reducer<any, AnyAction> }) {
	return WrappedComponent =>
		withContext(ReactReduxContext)(
			class extends React.Component<IProps> {
				reducerManager: IReducerManager;

				constructor(props) {
					super(props);
					const { store } = this.props.context;
					this.reducerManager = (store as SportyWideStore).reducerManager;
				}

				getInitialProps() {
					for (const [key, reducer] of Object.entries(reducers)) {
						this.reducerManager.add(key, reducer);
					}
					return {};
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
		);
}
