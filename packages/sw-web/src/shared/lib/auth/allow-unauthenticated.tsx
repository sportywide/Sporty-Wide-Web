import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export function allowUnauthenticated(WrappedComponent) {
	const NewComponent = function(props) {
		return <WrappedComponent {...props} />;
	};

	NewComponent.allowUnauthenticated = true;
	hoistNonReactStatics(NewComponent, WrappedComponent);

	return NewComponent;
}
