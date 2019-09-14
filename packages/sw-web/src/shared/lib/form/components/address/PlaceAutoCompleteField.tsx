import React, { useRef } from 'react';
import { Input } from 'semantic-ui-react';
import { useEffect } from '@root/node_modules/@types/react';
declare const google;

const SwPlaceAutoCompleteFieldComponent: React.FC<any> = props => {
	const ref = useRef<any>();
	useEffect(() => {
		if (!ref.current) {
			return;
		}
		const autocomplete = new google.maps.places.Autocomplete(ref.current.inputRef.input, {
			types: ['geocode'],
		});

		// Avoid paying for data that you don't need by restricting the set of
		// place fields that are returned to just the address components.
		autocomplete.setFields(['address_component']);

		// When the user selects an address from the drop-down, populate the
		// address fields in the form.
		autocomplete.addListener('place_changed', console.log);
	}, []);
	return <Input ref={ref} />;
};

export const SwPlaceAutoCompleteField = SwPlaceAutoCompleteFieldComponent;
