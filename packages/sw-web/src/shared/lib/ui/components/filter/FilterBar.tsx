import React, { useState } from 'react';
import { SwSearchInput } from '@web/shared/lib/ui/components/filter/SearchInput';
import { SwSelectOption } from '@web/shared/lib/ui/components/filter/SelectOption';
import { SwMultiSelect } from '@web/shared/lib/ui/components/filter/MultiSelectOption';

export type BaseFilterOption = {
	type: 'select' | 'search' | 'multi_select';
	name: string;
	defaultValue?: any;
	placeholder?: any;
	right?: boolean;
};

export type SelectFilterOption = BaseFilterOption & {
	options: { text: string; value: any }[];
	disabled?: boolean;
};

export type FilterOption = SelectFilterOption | BaseFilterOption;

interface IProps {
	filterOptions: FilterOption[];
	onFilterBarChanged: (currentValues: Record<string, any>) => void;
}

export const SwFilterBar: React.FC<IProps> = ({ filterOptions = [], onFilterBarChanged }) => {
	const [filterBarValues, setFilterBarValues] = useState(getDefaultValues(filterOptions));
	return (
		<div className={'sw-flex sw-flex-center sw-flex-wrap'}>
			{filterOptions.map(option => (
				<span className={`sw-mr2 sw-mb2 ${option.right ? 'sw-tablet-flex-float-right' : ''}`} key={option.name}>
					{renderOption(option, filterBarValues[option.name] || '', (e, value) => {
						const newValues = {
							...filterBarValues,
							[option.name]: value,
						};
						setFilterBarValues(newValues);
						onFilterBarChanged(newValues);
					})}
				</span>
			))}
		</div>
	);
};

function getDefaultValues(options: FilterOption[]) {
	return options.reduce((currentValues, option) => {
		return {
			...currentValues,
			[option.name]: option.defaultValue,
		};
	}, {});
}

function renderOption(option: FilterOption, value: any, onChange) {
	switch (option.type) {
		case 'select':
			return <SwSelectOption filterOption={option as SelectFilterOption} value={value} onChange={onChange} />;
		case 'multi_select':
			return <SwMultiSelect filterOption={option as SelectFilterOption} value={value} onChange={onChange} />;
		case 'search':
			return <SwSearchInput filterOption={option} value={value} onChange={onChange} />;
	}
}
