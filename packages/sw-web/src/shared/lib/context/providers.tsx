import React from 'react';

export function withContext(Context) {
	return WrappedComponent => props => {
		return <Context.Consumer>{context => <WrappedComponent {...props} context={context} />}</Context.Consumer>;
	};
}
