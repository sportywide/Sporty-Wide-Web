import React from 'react';
import { Tab } from 'semantic-ui-react';

export function TabPane({ children }) {
	return (
		<Tab.Pane as="div" attached={false} className={'sw-flex-grow sw-relative sw-flex sw-flex-column'}>
			{children}
		</Tab.Pane>
	);
}
