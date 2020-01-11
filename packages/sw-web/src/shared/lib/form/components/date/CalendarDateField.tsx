import React from 'react';
import { getFormikFieldError, setFormikFieldValue } from '@web/shared/lib/form/components/FormField';
import { Field, FieldProps } from 'formik';
import { format, isAfter, isBefore, parse } from 'date-fns';
import { DateInput, DateInputProps } from 'semantic-ui-react-calendar';
import { isValidDate } from '@shared/lib/utils/date/validation';

export interface CalendarFieldProps extends Omit<Omit<DateInputProps, 'value'>, 'onChange'> {
	label: string;
	name: string;
	dateFormat?: string;
	onChange?: (e: React.SyntheticEvent<HTMLElement>, data: any) => void;
	onBlur?: (e: React.FocusEvent<any>) => void;
}

const SwCalendarDateComponent: React.FC<CalendarFieldProps> = ({
	label,
	name,
	dateFormat = 'dd-MM-yyyy',
	onChange,
	onBlur,
	maxDate,
	minDate,
	...componentProps
}) => {
	return (
		<div className={'field'}>
			<label>{label}</label>
			<Field
				name={name}
				render={(props: FieldProps) => {
					const { field, form } = props;
					const { value } = field;
					const error = getFormikFieldError(form, field);
					let valueString = value || '';
					if (isValidDate(value)) {
						valueString = format(value, dateFormat);
					} else if (value && value.length === dateFormat.length) {
						const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
						if (isValidDate(parsedDate)) {
							valueString = format(parsedDate, dateFormat);
						}
					}
					// @ts-ignore
					return React.createElement(DateInput, {
						...componentProps,
						name,
						error,
						dateFormat: dateFormat.toUpperCase(), //this is using moment format
						value: valueString,
						maxDate,
						minDate,
						onChange: (e, { value }) => {
							form.handleChange(e);
							let parsedValue;
							if (value && value.length === dateFormat.length) {
								parsedValue = parse(value, dateFormat, new Date());
							}

							if (isValidDate(parsedValue)) {
								if (maxDate && isAfter(parsedValue, maxDate)) {
									parsedValue = maxDate;
								}
								if (minDate && isBefore(parsedValue, minDate)) {
									parsedValue = minDate;
								}
								parsedValue = format(parsedValue, 'yyyy-MM-dd');
							} else {
								parsedValue = value;
							}

							setFormikFieldValue(form, name, parsedValue, true);
							if (onChange) {
								onChange(e, { name, parsedValue });
							}
						},
						onBlur: e => {
							form.handleBlur(e);
							if (onBlur) {
								onBlur(e);
							}
						},
					});
				}}
			/>
		</div>
	);
};

export const SwCalendarDateField = SwCalendarDateComponent;
