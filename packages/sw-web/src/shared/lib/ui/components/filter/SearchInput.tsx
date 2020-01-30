import React from 'react';
import { BaseFilterOption } from '@web/shared/lib/ui/components/filter/FilterBar';
import { useMonitorValue } from '@web/shared/lib/react/hooks';
import { Input } from 'semantic-ui-react';

interface IProps {
	filterOption: BaseFilterOption;
	value: any;
	onChange: Function;
}

const SwSearchInputComponent: React.FC<IProps> = ({ value, filterOption, onChange }) => {
	const [currentValue, setCurrentValue] = useMonitorValue(value);
	return (
		<Input
			value={currentValue}
			className={'sw-min-width-200'}
			placeholder={filterOption.placeholder}
			onChange={(e, { value }) => setCurrentValue(value)}
			onBlur={e => onChange(e, currentValue)}
		/>
	);
};

export const SwSearchInput = SwSearchInputComponent;
