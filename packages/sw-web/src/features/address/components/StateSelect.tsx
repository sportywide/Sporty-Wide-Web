import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FormFieldEvents, getFormikValue, SwFormField } from '@web/shared/lib/form/components/FormField';
import { Form } from 'semantic-ui-react';
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
	const [stateMap, setStateMap] = useState<{ [key: string]: StateDto }>({});
	const container = useContext(ContainerContext);
	useEffect(() => {
		if (!countryId) {
			setStateMap({});
			return;
		}
		(async () => {
			const addressService = container.get(AddressService);
			const states = await addressService.getStatesFromCountryId(countryId).toPromise();
			setStateMap(keyBy(states, 'name'));
		})();
	}, [countryId]);

	const options = useMemo(() => {
		const states = Object.values(stateMap);
		if (states.length) {
			formik.setFieldValue(name, states[0].name);
		} else {
			formik.setFieldValue(name, null);
		}
		return Object.values(stateMap).map(state => ({
			value: state.name,
			text: state.name,
			key: state.id,
		}));
	}, [stateMap]);

	const onInputvalueChange = useCallback(
		(...args) => {
			// @ts-ignore
			onValueChange(...args);
			const value = args[0];
			const state = stateMap[value];
			if (state) {
				onStateChange(state);
			} else {
				onStateChange({
					id: null,
					name: value,
					countryId,
				});
			}
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
			onValueChange={onInputvalueChange}
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

export const SwStateSelect = connect(SwStateSelectComponent);
