import React from 'react';
import { getFormikFieldError, setFormikFieldValue } from '@web/shared/lib/form/components/FormField';
import { Field, FieldProps } from 'formik';
import { parse, format } from 'date-fns';
import { DateInput, DateInputProps } from 'semantic-ui-calendar-react';
import { isValidDate } from '@shared/lib/utils/date/validation';

export interface CalendarFieldProps extends Omit<Omit<DateInputProps, 'value'>, 'onChange'> {
	label: string;
	name: string;
	dateFormat?: string;
	onChange?: (e: React.SyntheticEvent<HTMLElement>, data: any) => void;
	onBlur?: (e: React.FocusEvent<any>) => void;
}

const SwCalendarComponent: React.FC<CalendarFieldProps> = ({
	label,
	name,
	dateFormat = 'dd-MM-yyyy',
	onChange,
	onBlur,
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
					const valueString = isValidDate(value) ? format(value, dateFormat) : value || '';
					// @ts-ignore
					return React.createElement(DateInput, {
						...componentProps,
						name,
						error,
						dateFormat: dateFormat.toUpperCase(), //this is using moment format
						value: valueString,
						onChange: (e, { value }) => {
							form.handleChange(e);
							let parsedValue = value;
							if (value && value.length === dateFormat.length) {
								parsedValue = parse(value, dateFormat, new Date());
								if (!isValidDate(parsedValue)) {
									parsedValue = value;
								}
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

export const SwCalendarField = SwCalendarComponent;
