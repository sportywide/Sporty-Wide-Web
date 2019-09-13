import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FormFieldEvents, getFormikValue } from '@web/shared/lib/form/components/FormField';
import { noop } from '@shared/lib/utils/functions';
import { ContainerContext } from '@web/shared/lib/store';
import { AddressService } from '@web/features/address/services/address.service';
import { SwDropdownField } from '@web/shared/lib/form/components/DropdownField';
import { CityDto } from '@shared/lib/dtos/address/city.dto';
import { keyBy } from 'lodash';
import { connect } from 'formik';

interface IProps extends FormFieldEvents {
	name: string;
	label?: string;
	stateId: number | null;
	placeholder?: string;
	onCityChange?: (cityDto?: CityDto) => void;
}

const SwCitySelectComponent: React.FC<IProps> = ({
	stateId,
	name,
	label,
	placeholder,
	onValueChange = noop,
	onCityChange = noop,
	...otherProps
}) => {
	const formik = (otherProps as any).formik;
	const [cityMap, setCityMap] = useState<{ [key: string]: CityDto }>({});
	const container = useContext(ContainerContext);
	useEffect(() => {
		if (!stateId) {
			setCityMap({});
			return;
		}
		(async () => {
			const addressService = container.get(AddressService);
			const cities = await addressService.getCititesFromStateId(stateId).toPromise();
			setCityMap(keyBy(cities, 'name'));
		})();
	}, [stateId]);

	const options = useMemo(() => {
		const cities = Object.values(cityMap);
		if (cities.length) {
			formik.setFieldValue(name, cities[0].name);
		} else {
			formik.setFieldValue(name, null);
		}
		return Object.values(cityMap).map(city => ({
			value: city.name,
			text: city.name,
			key: city.id,
		}));
	}, [cityMap]);
	const onInputvalueChange = useCallback(
		(...args) => {
			// @ts-ignore
			onValueChange(...args);
			const value = args[0];
			const city = cityMap[value];
			if (city) {
				onCityChange(city);
			} else {
				onCityChange({
					id: null,
					name: value,
					stateId,
				});
			}
		},
		[onValueChange, onCityChange]
	);

	return (
		<SwDropdownField
			name={name}
			label={label}
			options={options}
			placeholder={placeholder}
			allowAdditions={true}
			onAddItem={handleAddition}
			onValueChange={onInputvalueChange}
			{...otherProps}
		/>
	);

	function handleAddition(e, { value }) {
		formik.setFieldValue(name, value);
		setCityMap({
			...cityMap,
			[value]: {
				id: null,
				name: value,
				stateId,
			},
		});
	}
};

export const SwCitySelect = connect(SwCitySelectComponent);
