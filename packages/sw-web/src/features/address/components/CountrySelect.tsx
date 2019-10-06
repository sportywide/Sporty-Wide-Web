import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ContainerContext } from '@web/shared/lib/store';
import { AddressService } from '@web/features/address/services/address.service';
import { CountryDto } from '@shared/lib/dtos/address/country.dto';
import { noop } from '@shared/lib/utils/functions';
import { Form } from 'semantic-ui-react';
import { useCurrentRef, useKeyMap } from '@web/shared/lib/react/hooks';

interface IProps {
	label?: string;
	value: string;
	placeholder?: string;
	onCountryChange?: (country: CountryDto | null) => void;
	onCountryLoaded: (country: CountryDto) => void;
}
const SwCountrySelectComponent: React.FC<IProps> = ({
	label,
	value,
	placeholder,
	onCountryChange = noop,
	onCountryLoaded,
}) => {
	const container = useContext(ContainerContext);
	const [init, setInit] = useState(true);
	const [countryData, countryDataRef, setCountryData] = useCurrentRef<{ countries: CountryDto[]; loaded: boolean }>({
		countries: [],
		loaded: false,
	});
	useEffect(() => {
		(async () => {
			setCountryData({ countries: [], loaded: false });
			try {
				const addressService = container.get(AddressService);
				const countries = await addressService.getCountries().toPromise();
				setCountryData({ countries, loaded: true });
			} catch {
				setCountryData({ countries: [], loaded: true });
			}
		})();
	}, [container, setCountryData]);

	useEffect(() => {
		if (!countryDataRef.current.loaded) {
			return;
		}
		const countries = countryDataRef.current.countries;
		let currentCountry = countries && countries.find(country => country.name === value);
		if (value && !currentCountry) {
			currentCountry = newCountry(value);
			setCountryData({ countries: countries.concat(currentCountry), loaded: true });
		}
		if (init && currentCountry) {
			onCountryLoaded(currentCountry);
			setInit(false);
		}
	}, [countryData, countryDataRef, init, onCountryLoaded, setCountryData, value]);

	const countryMap = useKeyMap(countryData.countries, 'name');

	const options = useMemo(() => {
		return countryData.countries.map(country => ({
			value: country.name,
			text: country.name,
			key: country.id,
		}));
	}, [countryData.countries]);

	return (
		<Form.Dropdown
			search={true}
			fluid={true}
			selection={true}
			value={value}
			label={label}
			name={'country'}
			placeholder={placeholder}
			options={options}
			allowAdditions={true}
			loading={!countryData.loaded}
			onAddItem={handleAddition}
			onChange={handleChange}
		/>
	);

	function handleAddition(e, { value }) {
		onCountryChange(newCountry(value));
	}

	function handleChange(e, { value }) {
		onCountryChange(countryMap[value]);
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

export const SwCountrySelect = SwCountrySelectComponent;
