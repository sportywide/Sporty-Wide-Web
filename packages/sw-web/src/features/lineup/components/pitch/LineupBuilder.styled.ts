import styled from 'styled-components';
import { device } from '@web/styles/constants/size';

export const LineupControl = styled.div`
	display: block;

	@media ${device.laptop} {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
`;
