import NumberInput from 'react-numeric-input';
import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
	position: relative;
	font-weight: 400;
	font-style: normal;
	display: inline-flex;
	color: rgba(0, 0, 0, 0.87);
`;

const WrappedInput = styled(NumberInput)`
	margin: 0;
	flex: 1 0 auto;
	outline: 0;
	line-height: 1.21428571em;
	width: 80px;
	font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
	padding: 0.5em 1.7em 0.5em 0 !important;
	background: #fff;
	border: 1px solid rgba(34, 36, 38, 0.15);
	color: rgba(0, 0, 0, 0.87);
	border-radius: 0.28571429rem;
	transition: border-color 0.1s ease, -webkit-box-shadow 0.1s ease;
	transition: box-shadow 0.1s ease, border-color 0.1s ease;
	transition: box-shadow 0.1s ease, border-color 0.1s ease, -webkit-box-shadow 0.1s ease;
	box-shadow: none;
	text-align: right;
	border-bottom-right-radius: 0px;
	border-top-right-radius: 0px;
`;
export function SwNumberInput({
	disabled,
	value,
	stepAmount,
	onChange,
	minValue,
	precision,
	maxValue,
}: {
	disabled?: boolean;
	value: string | number;
	stepAmount?: number;
	onChange: Function;
	minValue?: number;
	precision?: number;
	maxValue?: number;
}) {
	return (
		<InputContainer>
			<WrappedInput
				disabled={disabled}
				step={stepAmount}
				value={value}
				snap
				precision={precision}
				strict
				onChange={valueAsNumber => {
					if (minValue != undefined && valueAsNumber < minValue) {
						return;
					}
					if (maxValue != undefined && valueAsNumber > maxValue) {
						return;
					}
					onChange(valueAsNumber);
				}}
				onInvalid={console.error}
				min={minValue}
				max={maxValue}
			/>
		</InputContainer>
	);
}
