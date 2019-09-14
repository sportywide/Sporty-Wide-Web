import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FormFieldEvents, getFormikValue } from '@web/shared/lib/form/components/FormField';
import { ContainerContext } from '@web/shared/lib/store';
import { AddressService } from '@web/features/address/services/address.service';
import { CountryDto } from '@shared/lib/dtos/address/country.dto';
import { connect, FormikContext } from 'formik';
import { keyBy } from 'lodash';
import { noop } from '@shared/lib/utils/functions';
import { SwDropdownField } from '@web/shared/lib/form/components/DropdownField';

interface IProps extends FormFieldEvents {
	name: string;
	label?: string;
	placeholder?: string;
	onCountryChange?: (country: CountryDto | null) => void;
}
const SwCountrySelectComponent: React.FC<IProps> = ({
	name,
	label,
	placeholder,
	onCountryChange = noop,
	...otherProps
}) => {
	const formik: FormikContext<any> = (otherProps as any).formik;
	const value = getFormikValue(formik, name);
	const container = useContext(ContainerContext);
	const [loading, setLoading] = useState(false);
	const [countryMap, setCountryMap] = useState<{ [key: string]: CountryDto }>(null);
	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const addressService = container.get(AddressService);
				const countries = await addressService.getCountries().toPromise();
				const countryMap = keyBy(countries, 'name');
				if (value && !countryMap[value]) {
					countryMap[value] = newCountry(value);
				}
				setCountryMap(countryMap);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const options = useMemo(() => {
		return Object.values(countryMap || {}).map(country => ({
			value: country.name,
			text: country.name,
			key: country.id,
		}));
	}, [countryMap]);

	useEffect(() => {
		if (!countryMap) {
			return;
		}

		const country = countryMap[value];
		if (country) {
			onCountryChange(country);
		} else {
			onCountryChange(newCountry(value));
		}
	}, [countryMap, value]);

	return (
		<SwDropdownField
			name={name}
			label={label}
			placeholder={placeholder}
			options={options}
			allowAdditions={true}
			onAddItem={handleAddition}
			{...otherProps}
		/>
	);

	function handleAddition(e, { value }) {
		formik.setFieldValue(name, value);
		setCountryMap({
			...countryMap,
			[value]: {
				id: null,
				name: value,
			},
		});
	}
};

function newCountry(name) {
	return {
		id: null,
		name: name,
		phonecode: null,
		sortname: null,
	};
}

export const SwCountrySelect = connect(SwCountrySelectComponent);
