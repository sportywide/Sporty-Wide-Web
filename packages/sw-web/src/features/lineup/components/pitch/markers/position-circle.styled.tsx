import styled from 'styled-components';

export const SwPositionCircle = styled.div`
	border-radius: 50%;
	width: 30px;
	height: 30px;
	transform: translate(-50%, -50%);
	background-color: rgba(255, 255, 255, 0.8);
	position: absolute;
	z-index: 1;

	${({ droppable }) =>
		droppable &&
		`
			 background-color: yellow;
  			 width: 50px;
  			 height: 50px;
		`}

	${({ disabled }) =>
		disabled &&
		`
			background-color: rgba(255, 255, 255, 0.3);
		`}
	
	${({ active }) =>
		active &&
		`
			 background-color: green;
		`}
`;
