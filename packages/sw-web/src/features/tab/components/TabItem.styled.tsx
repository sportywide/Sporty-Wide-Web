import styled from 'styled-components';

export const EqualTab = styled.div.attrs(() => ({
	className: 'item',
}))`
	&&&&& {
		background-color: ${p => p.theme.colors.grey};
		${({ active }) =>
			active &&
			`
			background: none #fff;
			color: rgba(0,0,0,.95);
			border-top-width: 1px;
			border-color: #d4d4d5;
			font-weight: 700;
			margin-bottom: -1px;
			box-shadow: none;
		`}
		flex-grow: 1;
		display: flex;
		> a {
			flex-grow: 1;
			text-align: center;
			font-size: 16px;
			font-weight: normal;
			color: ${p => p.theme.colors.black};
		}

		&:last-child {
			border-top-right-radius: 0.28571429rem;
		}
	}
`;
