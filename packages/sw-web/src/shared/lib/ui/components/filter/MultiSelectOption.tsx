import React from 'react';
import { SelectFilterOption } from '@web/shared/lib/ui/components/filter/FilterBar';
import { Dropdown } from 'semantic-ui-react';

interface IProps {
	filterOption: SelectFilterOption;
	value: any;
	onChange: Function;
}

const SwMultiSelectComponent: React.FC<IProps> = ({ value, filterOption, onChange }) => {
	return (
		<Dropdown
			fluid
			className={'sw-min-width-200'}
			multiple
			selection
			placeholder={filterOption.placeholder}
			options={filterOption.options}
			value={value}
			onChange={(e, { value }) => onChange(e, value)}
		/>
	);
};

export const SwMultiSelect = SwMultiSelectComponent;
