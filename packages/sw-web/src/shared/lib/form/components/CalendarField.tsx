import React, { useState } from 'react';
import { DateInput } from 'semantic-ui-calendar-react';
import { SwFormField } from '@web/shared/lib/form/components/FormField';

const SwCalendarComponent: React.FC<any> = ({ componentProps: { label, ...componentProps }, ...props }) => {
	return (
		<div className={'field'}>
			<label>{label}</label>
			<SwFormField {...props} component={DateInput} componentProps={componentProps} />
		</div>
	);
};

export const SwCalendarField = SwCalendarComponent;
