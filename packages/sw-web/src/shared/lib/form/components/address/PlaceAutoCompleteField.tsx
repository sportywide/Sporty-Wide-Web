import React, { useContext, useEffect, useState } from 'react';
import { Form, Search } from 'semantic-ui-react';
import { Debounce } from '@shared/lib/utils/functions/debounce';
import { useLocation } from '@web/shared/lib/react/hooks';
import { ContainerContext } from '@web/shared/lib/store';
import { Container } from 'typedi';
import { PlacesService } from '@web/features/address/services/places.service';
import { AddressDto } from '@shared/lib/dtos/address/address.dto';
import { noop } from '@shared/lib/utils/functions';

const debounce = new Debounce(500);

interface IProps {
	onAddressSelected: (address: AddressDto) => void;
}

const SwPlaceAutoCompleteFieldComponent: React.FC<IProps> = ({ onAddressSelected = noop }) => {
	const container: typeof Container = useContext(ContainerContext);
	const placesService = container.get(PlacesService);
	const [searchQuery, setSearchQuery] = useState('');
	const [searching, setSearching] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [results, setResults] = useState([]);
	const location = useLocation();
	useEffect(() => {
		if (!searchQuery || searchQuery.length < 3) {
			return;
		}
		if (!searching) {
			return;
		}
		setIsLoading(true);

		debounce.run(async () => {
			try {
				const searchResults = await placesService.getPredictions({ searchQuery, location });
				setResults(
					searchResults.map(({ description, terms, place_id: placeId }) => ({
						title: description,
						terms,
						placeid: placeId,
					}))
				);
			} finally {
				setIsLoading(false);
				setSearching(false);
			}
		});
	}, [searchQuery, location]);
	return (
		<Form.Field>
			<Search
				input={{ icon: 'search', iconPosition: 'left' }}
				loading={isLoading}
				onResultSelect={onResultSelect}
				onSearchChange={(e, { value }) => {
					setSearchQuery(value);
					setSearching(true);
				}}
				value={searchQuery}
				results={results}
			/>
		</Form.Field>
	);

	async function onResultSelect(e, { result }) {
		const placeId = result.placeid;
		setSearchQuery(result.title);
		setSearching(false);
		const address = await placesService.getPlacesDetails(placeId);
		onAddressSelected(address);
	}
};

export const SwPlaceAutoCompleteField = SwPlaceAutoCompleteFieldComponent;
