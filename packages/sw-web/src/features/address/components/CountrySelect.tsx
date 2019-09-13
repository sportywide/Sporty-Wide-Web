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
	onValueChange = noop,
	onCountryChange = noop,
	...otherProps
}) => {
	const formik: FormikContext<any> = (otherProps as any).formik;
	const container = useContext(ContainerContext);
	const [selectedCountry, setSelectedCountry] = useState(null);
	const [countryMap, setCountryMap] = useState<{ [key: string]: CountryDto }>({});
	useEffect(() => {
		(async () => {
			const addressService = container.get(AddressService);
			const countries = await addressService.getCountries().toPromise();
			const countryMap = keyBy(countries, 'name');
			const value = getFormikValue(formik, name);
			if (value && !countryMap[value]) {
				countryMap[value] = newCountry(value);
			}
			if (countries.length && !value) {
				formik.setFieldValue(name, countries[0].name);
			}
			setCountryMap(countryMap);
		})();
	}, []);

	const options = useMemo(() => {
		return Object.values(countryMap).map(country => ({
			value: country.name,
			text: country.name,
			key: country.id,
		}));
	}, [countryMap]);

	useEffect(() => {
		const countries = Object.values(countryMap);
		if (!countries.length) {
			//hasn't loaded countries yet
			return;
		}

		const country = countryMap[selectedCountry];
		if (country) {
			onCountryChange(country);
		} else {
			onCountryChange(newCountry(selectedCountry));
		}
	}, [countryMap, selectedCountry]);

	return (
		<SwDropdownField
			name={name}
			label={label}
			placeholder={placeholder}
			options={options}
			allowAdditions={true}
			onAddItem={handleAddition}
			onValueChange={(...args) => {
				onValueChange(...args);
				const value = args[0];
				setSelectedCountry(value);
			}}
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
