import React, { useEffect } from 'react';
import { Field, FieldConfig, FieldProps, getIn } from 'formik';
import { noop } from '@shared/lib/utils/functions';

export interface FormFieldProps extends FieldConfig {
	component: string | React.ComponentType<any>;
	componentProps: any;
	onChange?: (e: React.ChangeEvent<any>, params?: { name?: string; value?: any }) => void;
	onBlur?: (e: React.FocusEvent<any>) => void;
	onValueChange?: (value: any) => void;
	children?: any;
}

export const getFormikFieldError = (form, field) => {
	const { name } = field;
	const touched = getIn(form.touched, name);
	return touched && getIn(form.errors, name);
};

export const setFormikFieldValue = (form, name, value, shouldValidate) => {
	form.setFieldValue(name, value, shouldValidate);
	form.setFieldTouched(name, true, shouldValidate);
};

export const SwFormField: React.FC<FormFieldProps> = ({
	component,
	componentProps = {},
	onChange = noop,
	onBlur = noop,
	onValueChange = noop,
	children,
	...fieldProps
}) => {
	return (
		<Field {...fieldProps}>
			{(props: FieldProps) => (
				<InnerField
					component={component}
					componentProps={componentProps}
					fieldProps={props}
					onValueChange={onValueChange}
					onChange={onChange}
					onBlur={onBlur}
				>
					{children}
				</InnerField>
			)}
		</Field>
	);
};

function InnerField({ componentProps, fieldProps, onValueChange, component: Component, children, onChange, onBlur }) {
	const { field, form } = fieldProps;
	const { value } = field;
	const error = getFormikFieldError(form, field);
	const valueProps = typeof value === 'boolean' ? { checked: value, value: '' } : { value: value || '' };
	useEffect(() => {
		onValueChange(value);
	}, [value]);

	return (
		<Component
			{...componentProps}
			{...field}
			{...valueProps}
			error={error}
			onChange={(e, { name, value, checked }) => {
				form.handleChange(e);
				if (checked != null && value === '') {
					value = !!checked;
				}

				setFormikFieldValue(form, name, value, true);
				if (onChange) {
					onChange(e, { name, value });
				}
			}}
			onBlur={e => {
				form.handleBlur(e);
				if (onBlur) {
					onBlur(e);
				}
			}}
		>
			{children ? children({ fieldProps, componentProps, valueProps }) : null}
		</Component>
	);
}
