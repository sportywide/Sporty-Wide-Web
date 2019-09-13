import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FormFieldEvents, getFormikValue } from '@web/shared/lib/form/components/FormField';
import { connect } from 'formik';
import { AddressService } from '@web/features/address/services/address.service';
import { StateDto } from '@shared/lib/dtos/address/state.dto';
import { ContainerContext } from '@web/shared/lib/store';
import { keyBy } from 'lodash';
import { noop } from '@shared/lib/utils/functions';
import { SwDropdownField } from '@web/shared/lib/form/components/DropdownField';

interface IProps extends FormFieldEvents {
	name: string;
	label?: string;
	countryId: number | null;
	placeholder?: string;
	onStateChange?: (state?: StateDto) => void;
}

const SwStateSelectComponent: React.FC<IProps> = ({
	countryId,
	name,
	label,
	placeholder,
	onValueChange = noop,
	onStateChange = noop,
	...otherProps
}) => {
	const formik = (otherProps as any).formik;
	const [stateMap, setStateMap] = useState<{ [key: string]: StateDto }>(null);
	const container = useContext(ContainerContext);
	const [selectedState, setSelectedState] = useState();
	useEffect(() => {
		if (!countryId) {
			//enter a custom country
			if (stateMap) {
				setStateMap({});
				return;
			} else {
				const value = getFormikValue(formik, name);
				const newStateMap = {
					[value]: newState(value, countryId),
				};
				setStateMap(newStateMap);
				return;
			}
		}
		(async () => {
			const addressService = container.get(AddressService);
			const states = await addressService.getStatesFromCountryId(countryId).toPromise();
			const newStateMap = keyBy(states, 'name');
			const value = getFormikValue(formik, name);
			if (stateMap === null && value) {
				if (!newStateMap[value]) {
					newStateMap[value] = newState(value, countryId);
				}
			} else {
				formik.setFieldValue(name, states.length ? states[0].name : '');
			}
			setStateMap(newStateMap);
		})();
	}, [countryId]);

	const options = useMemo(() => {
		return Object.values(stateMap || {}).map(state => ({
			value: state.name,
			text: state.name,
			key: state.id,
		}));
	}, [stateMap]);

	useEffect(() => {
		if (!stateMap) {
			return;
		}
		if (stateMap[selectedState]) {
			onStateChange(stateMap[selectedState]);
		} else {
			onStateChange(newState(selectedState, countryId));
		}
	}, [stateMap, selectedState]);

	const onInputValueChange = useCallback(
		(...args) => {
			// @ts-ignore
			onValueChange(...args);
			const value = args[0];
			setSelectedState(value);
		},
		[onValueChange, onStateChange]
	);
	return (
		<SwDropdownField
			name={name}
			label={label}
			options={options}
			onAddItem={handleAddition}
			allowAdditions={true}
			placeholder={placeholder}
			onValueChange={onInputValueChange}
			{...otherProps}
		/>
	);

	function handleAddition(e, { value }) {
		formik.setFieldValue(name, value);
		setStateMap({
			...stateMap,
			[value]: {
				id: null,
				name: value,
			},
		});
	}
};

function newState(name, countryId) {
	return {
		id: null,
		name: name,
		countryId,
	};
}

export const SwStateSelect = connect(SwStateSelectComponent);
