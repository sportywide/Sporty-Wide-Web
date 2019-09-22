import React, { useContext, useEffect, useMemo, useState } from 'react';
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
	onStateChange = noop,
	...otherProps
}) => {
	const formik = (otherProps as any).formik;
	const [stateMap, setStateMap] = useState<{ [key: string]: StateDto }>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const container = useContext(ContainerContext);
	const value = getFormikValue(formik, name);
	useEffect(() => {
		if (!countryId) {
			const stateMap = {};
			if (value) {
				stateMap[value] = newState(value, countryId);
			}
			setStateMap(stateMap);
			setLoading(false);
			return;
		}
		(async () => {
			try {
				const addressService = container.get(AddressService);
				setLoading(true);
				const states = await addressService.getStatesFromCountryId(countryId).toPromise();
				const stateMap = keyBy(states, 'name');
				if (value) {
					if (!stateMap[value]) {
						stateMap[value] = newState(value, countryId);
					}
				} else {
					formik.setFieldValue(name, states.length ? states[0].name : '');
				}
				setStateMap(stateMap);
			} finally {
				setLoading(false);
			}
		})();
	}, [container, countryId, formik, name, value]);

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
		if (stateMap[value]) {
			onStateChange(stateMap[value]);
		} else {
			onStateChange(newState(value, countryId));
		}
	}, [countryId, onStateChange, stateMap, value]);

	return (
		<SwDropdownField
			name={name}
			label={label}
			options={options}
			loading={loading}
			onAddItem={handleAddition}
			allowAdditions={true}
			placeholder={placeholder}
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
