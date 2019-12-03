import React, { useContext, useEffect, useMemo, useState } from 'react';
import { noop } from '@shared/lib/utils/functions';
import { ContainerContext } from '@web/shared/lib/store';
import { AddressService } from '@web/features/address/services/address.service';
import { CityDto } from '@shared/lib/dtos/address/city.dto';
import { connect } from 'formik';
import { useCurrentRef, useKeyMap } from '@web/shared/lib/react/hooks';
import { Form } from 'semantic-ui-react';

interface IProps {
	label?: string;
	value: string;
	stateId: number | null;
	placeholder?: string;
	onCityChange?: (cityDto?: CityDto) => void;
	onCityLoaded?: (cityDto?: CityDto) => void;
}

const SwCitySelectComponent: React.FC<IProps> = ({
	stateId,
	label,
	placeholder,
	onCityChange = noop,
	onCityLoaded = noop,
	value,
}) => {
	const container = useContext(ContainerContext);
	const [cityData, cityDataRef, setCityData] = useCurrentRef<{ cities: CityDto[]; loaded: boolean }>({
		cities: [],
		loaded: false,
	});
	const [init, setInit] = useState(true);
	useEffect(() => {
		if (!stateId) {
			setCityData({ cities: [], loaded: true });
			return;
		}
		(async () => {
			setCityData({ cities: [], loaded: false });
			try {
				const addressService = container.get(AddressService);
				const cities = await addressService.getCititesFromStateId(stateId).toPromise();
				setCityData({ cities, loaded: true });
			} catch {
				setCityData({ cities: [], loaded: true });
			}
		})();
	}, [container, setCityData, stateId]);

	const options = useMemo(() => {
		return Object.values(cityData.cities).map(city => ({
			value: city.name,
			text: city.name,
			key: city.id,
		}));
	}, [cityData]);

	useEffect(() => {
		if (!cityDataRef.current.loaded) {
			return;
		}
		const cities = cityDataRef.current.cities;
		let currentCity = cities && cities.find(country => country.name === value);
		let newCities = cities;
		if (value && !currentCity) {
			currentCity = newCity(value, stateId);
			newCities = newCities.concat(currentCity);
			setCityData({ cities: newCities, loaded: true });
		}
		if (!value && newCities.length) {
			onCityChange(newCities[0]);
		}
		if (init && currentCity) {
			onCityLoaded(currentCity);
			setInit(false);
		}
	}, [cityData, cityDataRef, init, onCityChange, onCityLoaded, setCityData, stateId, value]);

	const cityMap = useKeyMap(cityData.cities, 'name');

	return (
		<Form.Dropdown
			search={true}
			fluid={true}
			selection={true}
			name={'city'}
			label={label}
			value={value}
			options={options}
			placeholder={placeholder}
			loading={!cityData.loaded}
			allowAdditions={true}
			onAddItem={handleAddition}
			onChange={handleChange}
		/>
	);

	function handleAddition(e, { value = undefined }) {
		onCityChange(newCity(value, stateId));
	}

	function handleChange(e, { value = undefined }) {
		onCityChange(cityMap[value]);
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
