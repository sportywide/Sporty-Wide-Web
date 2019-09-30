import React, { useEffect } from 'react';
import { Field, FieldProps, FormikContext, getIn } from 'formik';
import { noop } from '@shared/lib/utils/functions';
import { shouldUpdate } from 'recompose';
import { isEqual } from 'lodash';

export interface FormFieldEvents {
	onChange?: (e: React.ChangeEvent<any>, params?: { name?: string; value?: any }) => void;
	onBlur?: (e: React.FocusEvent<any>) => void;
	onValueChange?: (value: any, name?: string) => void;
}

export const defaultFormFieldEvents: FormFieldEvents = {
	onChange: noop,
	onBlur: noop,
	onValueChange: noop,
};

export interface FormFieldProps<P> extends FormFieldEvents {
	component: React.FunctionComponent<P>;
	componentProps: P;
	name: string;
	type?: string;
	children?: any;
	validate?: (value: any) => string | Promise<void> | undefined;
}

export const getFormikFieldError = (form, field) => {
	const { name } = field;
	const touched = getIn(form.touched, name);
	return (touched || form.submitCount > 0) && getIn(form.errors, name);
};

export const getFormikValue = (formik: FormikContext<any>, name) => {
	return getIn(formik.values, name);
};

export const setFormikFieldValue = (form, name, value, shouldValidate) => {
	form.setFieldValue(name, value, shouldValidate);
	form.setFieldTouched(name, true, shouldValidate);
};

function InnerFieldComponent({
	componentProps,
	name,
	value,
	error,
	form,
	component: Component,
	onValueChange,
	onChange,
	onBlur,
}) {
	const valueProps = typeof value === 'boolean' ? { checked: value, value: '' } : { value: value || '' };
	useEffect(() => {
		onValueChange(value, name);
	}, [name, onValueChange, value]);
	return (
		<Component
			name={name}
			{...componentProps}
			{...valueProps}
			error={error}
			onChange={(e, { name, value, checked }) => {
				if (checked != null && (value === '' || value == undefined)) {
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
		/>
	);
}

const InnerField = shouldUpdate((oldProps: any, newProps: any) => {
	return !isEqual(
		{
			componentProps: oldProps.componentProps,
			name: oldProps.name,
			value: oldProps.value,
			error: oldProps.error,
		},
		{
			componentProps: newProps.componentProps,
			name: newProps.name,
			value: newProps.value,
			error: newProps.error,
		}
	);
})(InnerFieldComponent);

const SwFormFieldComponent = <T extends object>({
	component,
	componentProps = {} as T,
	onChange = noop,
	onBlur = noop,
	onValueChange = noop,
	...fieldProps
}: FormFieldProps<T>) => {
	return (
		<Field {...fieldProps}>
			{(props: FieldProps) => {
				const { field, form } = props;
				const { value, name } = field;
				const error = getFormikFieldError(form, field);
				return (
					<InnerField
						component={component}
						componentProps={componentProps}
						onValueChange={onValueChange}
						value={value}
						name={name}
						form={form}
						error={error}
						onChange={onChange}
						onBlur={onBlur}
					/>
				);
			}}
		</Field>
	);
};

export const SwFormField = SwFormFieldComponent;
