import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AddressService } from '@web/features/address/services/address.service';
import { StateDto } from '@shared/lib/dtos/address/state.dto';
import { ContainerContext } from '@web/shared/lib/store';
import { noop } from '@shared/lib/utils/functions';
import { Form } from 'semantic-ui-react';
import { useCurrentRef, useKeyMap, usePrevious } from '@web/shared/lib/react/hooks';

interface IProps {
	value: string;
	label?: string;
	countryId: number | null;
	placeholder?: string;
	onStateChange?: (state?: StateDto) => void;
	onStateLoaded?: (state?: StateDto) => void;
}

const SwStateSelectComponent: React.FC<IProps> = ({
	onStateLoaded,
	countryId,
	value,
	label,
	placeholder,
	onStateChange = noop,
}) => {
	const [stateData, stateDataRef, setStateData] = useCurrentRef<{ states: StateDto[]; loaded: boolean }>({
		states: [],
		loaded: false,
	});
	const [init, setInit] = useState(true);
	const container = useContext(ContainerContext);
	useEffect(() => {
		if (!countryId) {
			setStateData({ states: [], loaded: true });
			return;
		}
		(async () => {
			setStateData({ states: [], loaded: false });
			try {
				const addressService = container.get(AddressService);
				const states = await addressService.getStatesFromCountryId(countryId).toPromise();
				setStateData({ states, loaded: true });
			} catch {
				setStateData({ states: [], loaded: true });
			}
		})();
	}, [container, countryId, setStateData]);

	useEffect(() => {
		if (!stateDataRef.current.loaded) {
			return;
		}
		const states = stateDataRef.current.states;
		let currentState = states && states.find(state => state.name === value);
		let newStates = states;
		if (value && !currentState) {
			currentState = newState(value, countryId);
			newStates = states.concat(currentState);
			setStateData({ states: newStates, loaded: true });
		}

		if (!value && newStates.length) {
			onStateChange(newStates[0]);
		}

		if (init && currentState) {
			onStateLoaded(currentState);
			setInit(false);
		}
	}, [countryId, init, onStateChange, onStateLoaded, setStateData, stateData, stateDataRef, value]);

	const stateMap = useKeyMap(stateData.states, 'name');

	const options = useMemo(() => {
		return Object.values(stateData.states).map(state => ({
			value: state.name,
			text: state.name,
			key: state.id,
		}));
	}, [stateData]);

	return (
		<Form.Dropdown
			search={true}
			fluid={true}
			selection={true}
			value={value}
			name={'state'}
			label={label}
			options={options}
			loading={!stateData.loaded}
			onAddItem={handleAddition}
			onChange={handleChange}
			allowAdditions={true}
			placeholder={placeholder}
		/>
	);

	function handleAddition(e, { value }) {
		onStateChange(newState(value, countryId));
	}

	function handleChange(e, { value }) {
		onStateChange(stateMap[value]);
	}
};

function newState(name, countryId) {
	return {
		id: null,
		name: name,
		countryId,
	};
}

export const SwStateSelect = SwStateSelectComponent;
