import styled from 'styled-components';
import { Image, GridColumn } from 'semantic-ui-react';

export const SwLeagueImage = styled(Image)`
	&&& {
		min-height: 150px;
	}
`;

export const SwLeagueContainer = styled(GridColumn)`
	&&& {
		display: flex !important;
		align-items: center;
		cursor: pointer;
	}
`;

export const SwLeagueTitle = styled.div`
	text-align: center;
	font-weight: 700;
	margin-top: var(--space-2);
`;
