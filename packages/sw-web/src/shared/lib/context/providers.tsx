import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export function withContext(Context, propName = 'context') {
	return WrappedComponent => {
		const NewComponent = props => {
			return (
				<Context.Consumer>
					{context => <WrappedComponent {...{ ...props, [propName]: context }} />}
				</Context.Consumer>
			);
		};

		hoistNonReactStatics(NewComponent, WrappedComponent);

		return NewComponent;
	};
}
