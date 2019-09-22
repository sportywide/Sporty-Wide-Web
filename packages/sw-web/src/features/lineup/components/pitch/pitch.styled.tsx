import styled from 'styled-components';

export const SwStyledPitch = styled.div`
	max-height: 100%;
	overflow-y: auto;
	display: inline-block;
	float: right;
	@media (max-width: 768px) {
		float: none;
	}
`;

export const SwStyledPitchBackground = styled.img`
	max-height: 600px;
	min-height: calc(100vh - 15px);
	max-width: 100%;
`;
