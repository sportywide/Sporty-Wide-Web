import styled, { css } from 'styled-components';
import { Container } from 'semantic-ui-react';
import { device, size } from '@web/styles/constants/size';

const swBackground = css`
	width: 100%;
	height: 100%;
	min-height: 100vh;
	display: flex;
	@media ${device.tablet} {
		${({ padding }) =>
			padding &&
			`
			 padding-top: var(--space-1);
			 padding-bottom: var(--space-1);
		`}
	}
`;
export const SwPrimaryBackGround = styled.div`
	${swBackground};
	background-color: ${props => props.theme.colors.primary};
`;

export const SwGreyBackground = styled.div`
	${swBackground};
	@media ${device.tablet} {
		background-color: ${props => props.theme.colors.grey};
	}
`;

export const SwTransparentBackground = styled.div`
	${swBackground};
	background-color: ${props => props.theme.colors.transparent};
`;

export const SwFluidContainer = styled.div`
	width: 100%;
	margin-top: ${props => props.theme.dimen.navBar};
	@media ${device.tablet} {
		margin: var(--space-3) auto;
		margin-top: calc(var(--space-3) + ${props => props.theme.dimen.navBar});
	}
`;

export const SwContainer = styled(Container).attrs({ id: 'container' })`
	&&&&&&& {
		background-color: ${props => props.theme.colors.white};
		padding: var(--space-3);
		margin-bottom: 0;
		margin-top: ${props => props.theme.dimen.navBar};
		@media (max-width: ${size.tablet - 1}px) {
			width: 100%;
		}
		@media ${device.tablet} {
			margin: var(--space-3) auto;
			margin-top: calc(var(--space-3) + ${props => props.theme.dimen.navBar});
			border-radius: 5px;
			box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.2);
		}
		min-height: calc(100vh - 2 * var(--space-3));
		position: relative;
		display: flex;
		flex-direction: column;
	}
`;

export const SwFullWidth = styled(Container)`
	&&& {
		width: 100%;
		height: 100%;
	}
`;
