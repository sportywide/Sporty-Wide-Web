import React from 'react';
import { Tab } from 'semantic-ui-react';
import { updateCurrentUrl } from '@web/shared/lib/url';

export function TabPane({ children }) {
	return (
		<Tab.Pane as="div" attached={false} className={'sw-flex-grow sw-relative sw-flex sw-flex-column'}>
			{children}
		</Tab.Pane>
	);
}

export function updateTab(panes, tabName) {
	let selectedTabIndex = panes.findIndex(({ name }) => name === tabName);
	if (selectedTabIndex < 0) {
		selectedTabIndex = 0;
	}
	const selectedTab = panes[selectedTabIndex];
	const selectedTabName = selectedTab.name;
	updateCurrentUrl({
		query: {
			tab: selectedTabName,
		},
	});
	return selectedTabIndex;
}
