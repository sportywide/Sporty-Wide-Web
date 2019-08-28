import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';

export function checkUser(checkFunction, failureRedirect = 'login') {
	return WrappedComponent => {
		const NewComponent = function(props) {
			return <WrappedComponent {...props} />;
		};

		NewComponent.checkUser = checkFunction;
		NewComponent.failureRedirect = failureRedirect;
		hoistNonReactStatics(NewComponent, WrappedComponent);

		return NewComponent;
	};
}

export const allowAll = () => true;
export const allowActiveOnly = user => user && user.status === UserStatus.ACTIVE;
export const allowAnonymousOnly = user => !user;
export const allowPendingSocialOnly = user => user && user.socialProvider && user.status === UserStatus.ACTIVE;
export const hasUser = user => !!user;
export const notAllowActive = user => !user || user.status !== UserStatus.ACTIVE;
