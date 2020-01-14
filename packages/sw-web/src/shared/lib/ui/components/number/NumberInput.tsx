import NumberInput from 'semantic-ui-react-numberinput';
import React from 'react';
import styled from 'styled-components';

const WrappedInput = styled(NumberInput)`
	&&&& {
		input {
			max-width: 80px;
		}
	}
`;
export function SwNumberInput({
	value,
	stepAmount,
	onChange,
	minValue,
	maxValue,
}: {
	value: string | number;
	stepAmount?: number;
	onChange: Function;
	minValue?: number;
	maxValue?: number;
}) {
	return (
		<WrappedInput
			valueType="decimal"
			allowEmptyValue
			buttonPlacement="right"
			stepAmount={stepAmount}
			value={value}
			onChange={onChange}
			minValue={minValue}
			maxValue={maxValue}
		/>
	);
}
