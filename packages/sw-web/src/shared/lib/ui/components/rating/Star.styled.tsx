import styled from 'styled-components';

export const StarContainer = styled.div`
	display: inline-block;
	margin-top: 1rem;
`;

export const Star = styled.div`
	position: relative;
	font-weight: 900;
	width: 1rem;
	height: 1rem;
	display: inline-block;
	
	&:after {
		font-size: 1rem;
		font-family: 'Font Awesome 5 Free';
		content: '\\f005';
		position: absolute;
		left: 0;
		color: #d9d9d9;
	}
	
	${({ readonly }) =>
		!readonly &&
		`
			&:hover ~ &:after {
				font-weight: 400;
				color: #fde16d;
			}
		`}
	
	
	
	${({ half }) =>
		half &&
		`
			&:before {
				font-size: 1rem;
				font-family: 'Font Awesome 5 Free';
				content: '\\f089';
				color: #fde16d;
				position: absolute;
				left: 0;
				z-index: 1;
			}
		`}
	
	${({ half, readonly }) =>
		half &&
		!readonly &&
		`
			&:after {
				font-weight: 400;
				color: #fde16d;
			}
		`}
	
	${({ checked }) =>
		checked &&
		`
			&:after {
				color: #fde16d;
				content: '\\f005';
			}
		`}
`;
