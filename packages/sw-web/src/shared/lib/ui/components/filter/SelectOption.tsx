import React from 'react';
import { SelectFilterOption } from '@web/shared/lib/ui/components/filter/FilterBar';
import { Select } from 'semantic-ui-react';

interface IProps {
	filterOption: SelectFilterOption;
	value: any;
	onChange: Function;
}

const SwSelectOptionComponent: React.FC<IProps> = ({ value, filterOption, onChange }) => {
	return (
		<Select
			placeholder={filterOption.placeholder}
			options={filterOption.options}
			value={value}
			onChange={(e, { value }) => onChange(e, value)}
		/>
	);
};

export const SwSelectOption = SwSelectOptionComponent;
