import React from 'react';
import { ReactReduxContext } from 'react-redux';
import { ISportyWideStore } from '../store';
import { withContext } from '../context/providers';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { IEpicManager } from '@web/shared/lib/redux/epic-manager';

interface IProps {
	context: ReactReduxContext;
}

export function registerEpic(...epics) {
	return WrappedComponent => {
		class NewComponent extends React.Component<IProps> {
			epicManager: IEpicManager;

			constructor(props) {
				super(props);
				const { store } = this.props.context;
				this.epicManager = (store as ISportyWideStore).epicManager;
			}

			componentWillMount() {
				NewComponent.registerEpics(this.epicManager);
			}

			static registerEpics(epicManager: IEpicManager) {
				epicManager.add(...epics);
			}

			render() {
				return <WrappedComponent {...this.props} />;
			}
		}

		hoistNonReactStatics(NewComponent, WrappedComponent);

		return withContext(ReactReduxContext)(NewComponent);
	};
}
