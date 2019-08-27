import React from 'react';
import { Field, getIn } from 'formik';

const getFormikFieldError = (form, field) => {
	const { name } = field;
	const touched = getIn(form.touched, name);
	return touched && getIn(form.errors, name);
};

const setFormikFieldValue = (form, name, value, shouldValidate) => {
	form.setFieldValue(name, value, shouldValidate);
	form.setFieldTouched(name, true, shouldValidate);
};

export const SwFormField = ({ component, componentProps = {}, onChange, ...fieldProps }: any) => (
	<Field
		{...fieldProps}
		render={props => {
			const { id } = componentProps;
			const { field, form } = props;
			const { value } = field;
			const error = getFormikFieldError(form, field);
			componentProps.id = id;
			componentProps.error = error;
			const valueProps = typeof value === 'boolean' ? { checked: value, value: '' } : { value: value || '' };
			return React.createElement(component, {
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
				onBlur: form.handleBlur,
			});
		}}
	/>
);
