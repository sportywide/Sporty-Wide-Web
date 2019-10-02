import { defaultFormFieldEvents, FormFieldEvents, SwFormField } from '@web/shared/lib/form/components/FormField';
import React from 'react';
import { Form } from 'semantic-ui-react';
import { mergeProps } from '@web/shared/lib/helpers/props';
import { omit } from 'lodash';
import { FieldConfig } from 'formik';

export interface DropdownFieldProps extends FormFieldEvents, FieldConfig {
	options: any[];
	[key: string]: any;
}

const SwDropdownFieldComponent: React.FC<DropdownFieldProps> = ({ name, ...props }) => {
	const fieldProps = mergeProps(defaultFormFieldEvents, props);
	const componentProps: any = omit(props, Object.keys(fieldProps));
	return (
		<SwFormField
			name={name}
			component={Form.Dropdown}
			componentProps={{
				search: true,
				fluid: true,
				selection: true,
				...componentProps,
			}}
			{...fieldProps}
		/>
	);
};

export const SwDropdownField = SwDropdownFieldComponent;
