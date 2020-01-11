import React, { useEffect, useState } from 'react';
import { format, parse } from 'date-fns';
import { DatesRangeInput } from 'semantic-ui-react-calendar';
import { noop } from '@shared/lib/utils/functions';
import styled from 'styled-components';
import { isValidDate } from '@shared/lib/utils/date/validation';
import { device } from '@web/styles/constants/size';

export interface IDateRange {
	start: Date | null;
	end: Date | null;
}
interface IProps {
	name: string;
	placeholder: string;
	minDate?: Date;
	maxDate?: Date;
	iconPosition: 'left' | 'right';
	value: IDateRange;
	onChange: (e, value: IDateRange) => void;
	onClear?: () => void;
}

const InputWrapper = styled(DatesRangeInput)`
	max-width: 140px;
	@media ${device.mobileM} {
		max-width: 170px;
	}
	@media ${device.tablet} {
		max-width: 220px;
	}
	.ui.input {
		width: 100%;
	}
`;
const DATE_FORMAT = 'dd/MM/yyyy';
export const SwDateRange: React.FC<IProps> = ({
	iconPosition,
	placeholder,
	name,
	value: rangeValue,
	minDate,
	maxDate,
	onChange = noop,
	onClear = noop,
}) => {
	const [inputValue, setInputValue] = useState('');
	useEffect(() => {
		setInputValue(formatDateRange(rangeValue));
	}, [rangeValue]);
	return (
		<InputWrapper
			allowSameEndDate={false}
			clearable
			onClear={onClear}
			minDate={minDate}
			maxDate={maxDate}
			onBlur={e => {
				if (!e || e.target.nodeName !== 'INPUT') {
					return;
				}
				const { start, end } = parseDateRange(e.target.value);
				if (!isValid(start) || !isValid(end) || start > end) {
					// reset value
					onChange(e, { ...rangeValue });
				} else {
					onChange(e, { start, end });
				}
			}}
			name={name}
			initialDate={'2020-01-01'}
			dateFormat={'DD/MM/YYYY'}
			placeholder={placeholder}
			value={inputValue}
			iconPosition={iconPosition}
			onChange={(e, data) => {
				const { value } = data;
				if (e.nativeEvent instanceof MouseEvent) {
					onChange(e, parseDateRange(value));
				}
				setInputValue(value);
			}}
		/>
	);

	function isValid(date) {
		return isValidDate(date) && isInRange(date);
	}

	function isInRange(date) {
		if (minDate && minDate > date) {
			return false;
		}

		if (maxDate && maxDate < date) {
			return false;
		}

		return true;
	}
};

function formatDateRange(dateRange: IDateRange) {
	return [dateRange.start, dateRange.end]
		.map(date => {
			if (!date) {
				return '';
			}
			return format(date, DATE_FORMAT);
		})
		.join(' - ');
}

function parseDateRange(dateInput = '') {
	const [start, end] = dateInput.split('-').map(val => val.trim());
	return {
		start: (start || null) && parse(start, DATE_FORMAT, new Date()),
		end: (end || null) && parse(end, DATE_FORMAT, new Date()),
	};
}
