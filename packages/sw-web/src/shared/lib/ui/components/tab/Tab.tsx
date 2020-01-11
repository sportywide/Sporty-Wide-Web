import React from 'react';
import { Tab } from 'semantic-ui-react';
import styled from 'styled-components';

const TabWrapper = styled(Tab)`
	.ui.menu::-webkit-scrollbar {
		display: none;
	}

	.ui.menu {
		overflow: auto;
	}
`;
export const SwTab = function(props) {
	return <TabWrapper {...props} />;
};
