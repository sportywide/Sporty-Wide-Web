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
	font-weight: bold;
	padding-right: 5px;
`;

export const FixtureLine = styled.div`
	:not(last-child) {
		border-bottom: 1px solid #dcdcdc;
	}
	cursor: pointer;
	padding: 8px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const FixtureStatus = styled.div`
	font-weight: bold;
	text-align: right;
	width: 55px;
	padding-left: 5px;
`;
export const FixtureMain = styled.div`
	flex: 1 1 0;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
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
