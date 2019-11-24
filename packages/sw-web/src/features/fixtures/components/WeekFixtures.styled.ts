import styled from 'styled-components';
import { Header } from 'semantic-ui-react';
export const FixtureDateHeadline = styled(Header)`
	&&& {
		background-color: #011b51;
		text-align: center;
		padding: 5px 0;
		color: white;
		margin: 0;
	}
`;

export const FixtureTime = styled.div`
	width: 100px;
	font-weight: bold;
`;

export const FixtureLine = styled.div`
	:not(last-child) {
		border-bottom: 1px solid #dcdcdc;
	}

	padding: 8px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const FixtureStatus = styled.div`
	font-weight: bold;
	width: 100px;
`;
export const FixtureMain = styled.div`
	flex-grow: 1;
	display: flex;
	align-items: center;
	justify-content: center;
`;
export const FixtureScore = styled.div`
	color: white;
	font-weight: bold;
	background: #d6181f;
	margin: 0 8px;
	width: 60px;
	text-align: center;
	padding: 4px 0;
	display: inline-block;
`;

export const FixtureTeam = styled.div`
	font-weight: bold;
	flex: 1 1 0;
	text-align: ${p => (p.home ? 'right' : 'left')};
`;
