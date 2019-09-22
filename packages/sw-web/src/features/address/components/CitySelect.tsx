import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FormFieldEvents, getFormikValue } from '@web/shared/lib/form/components/FormField';
import { noop } from '@shared/lib/utils/functions';
import { ContainerContext } from '@web/shared/lib/store';
import { AddressService } from '@web/features/address/services/address.service';
import { SwDropdownField } from '@web/shared/lib/form/components/DropdownField';
import { CityDto } from '@shared/lib/dtos/address/city.dto';
import { keyBy } from 'lodash';
import { connect, FormikContext } from 'formik';

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
	onCityChange = noop,
	...otherProps
}) => {
	const formik: FormikContext<any> = (otherProps as any).formik;
	const [cityMap, setCityMap] = useState<{ [key: string]: CityDto }>(null);
	const container = useContext(ContainerContext);
	const [loading, setLoading] = useState<boolean>(false);
	const value = getFormikValue(formik, name);
	useEffect(() => {
		if (!stateId) {
			const cityMap = {};
			if (value) {
				cityMap[value] = newCity(value, stateId);
			}
			setCityMap(cityMap);
			setLoading(false);
			return;
		}
		(async () => {
			try {
				const addressService = container.get(AddressService);
				setLoading(true);
				const cities = await addressService.getCititesFromStateId(stateId).toPromise();
				const newCityMap = keyBy(cities, 'name');
				const value = getFormikValue(formik, name);
				if (value) {
					if (!newCityMap[value]) {
						newCityMap[value] = newCity(value, stateId);
					}
				} else {
					formik.setFieldValue(name, cities.length ? cities[0].name : '');
				}
				setCityMap(newCityMap);
			} finally {
				setLoading(false);
			}
		})();
	}, [container, formik, name, stateId, value]);

	const options = useMemo(() => {
		return Object.values(cityMap || {}).map(city => ({
			value: city.name,
			text: city.name,
			key: city.id,
		}));
	}, [cityMap]);

	useEffect(() => {
		if (!cityMap) {
			return;
		}
		if (cityMap[value]) {
			onCityChange(cityMap[value]);
		} else {
			onCityChange(newCity(value, stateId));
		}
	}, [cityMap, onCityChange, stateId, value]);

	return (
		<SwDropdownField
			name={name}
			label={label}
			options={options}
			placeholder={placeholder}
			loading={loading}
			allowAdditions={true}
			onAddItem={handleAddition}
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

function newCity(name, stateId) {
	return {
		id: null,
		name,
		stateId,
	};
}

export const SwCitySelect = connect(SwCitySelectComponent);
