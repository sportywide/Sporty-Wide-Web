import styled from 'styled-components';
import { SwIcon } from '@web/shared/lib/icon';
import { device } from '@web/styles/constants/size';

export const FixtureScore = styled.div`
	font-size: 40px;
	margin-top: 20px;
`;

export const SoccerIcon = styled(SwIcon)`
	display: none;
	@media ${device.laptop} {
		display: inline-block;
	}
`;
