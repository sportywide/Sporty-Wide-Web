import styled from 'styled-components';
import { GridColumn, Image } from 'semantic-ui-react';

export const SwLeagueImage = styled(Image)`
	&&& {
		min-height: 200px;
	}
`;

export const SwLeagueWrapper = styled.div`
	padding: 20px;
	border: 1px solid rgba(0, 0, 0, 0);
	:hover {
		border: 1px solid black;
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
	display: flex;
	align-items: center;
	justify-content: center;
`;
