import React from 'react';
import { Field, FieldConfig, FieldProps, getIn } from 'formik';

export interface FormFieldProps extends FieldConfig {
	component: string | React.ComponentType<any>;
	componentProps: any;
	onChange?: (e: React.ChangeEvent<any>, params?: { name?: string; value?: any }) => void;
	onBlur?: (e: React.FocusEvent<any>) => void;
}

const getFormikFieldError = (form, field) => {
	const { name } = field;
	const touched = getIn(form.touched, name);
	return touched && getIn(form.errors, name);
};

const setFormikFieldValue = (form, name, value, shouldValidate) => {
	form.setFieldValue(name, value, shouldValidate);
	form.setFieldTouched(name, true, shouldValidate);
};

export const SwFormField: React.FC<FormFieldProps> = ({
	component,
	componentProps = {},
	onChange,
	onBlur,
	children,
	...fieldProps
}) => (
	<Field
		{...fieldProps}
		render={(props: FieldProps) => {
			const { id } = componentProps;
			const { field, form } = props;
			const { value } = field;
			const error = getFormikFieldError(form, field);
			componentProps.id = id;
			componentProps.error = error;
			const valueProps = typeof value === 'boolean' ? { checked: value, value: '' } : { value: value || '' };
			return React.createElement(
				component,
				{
					...componentProps,
					...field,
					...props,
					...valueProps,
					onChange: (e, { name, value, checked }) => {
						if (checked != null && value === '') {
							value = !!checked;
						}

						setFormikFieldValue(form, name, value, true);
						if (onChange) {
							onChange(e, { name, value });
						}
					},
					onBlur: e => {
						form.handleBlur(e);
						if (onBlur) {
							onBlur(e);
						}
					},
				},
				children
			);
		}}
	/>
);
