import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export function withContext(Context) {
	return WrappedComponent => {
		const NewComponent = props => {
			return <Context.Consumer>{context => <WrappedComponent {...props} context={context} />}</Context.Consumer>;
		};

		hoistNonReactStatics(NewComponent, WrappedComponent);

		return NewComponent;
	};
}
