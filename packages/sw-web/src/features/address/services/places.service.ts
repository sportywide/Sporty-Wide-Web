import { Service } from 'typedi';
import axios from 'axios';
import { AddressDto } from '@shared/lib/dtos/address/address.dto';
const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
const API_KEY = 'AIzaSyA8PuZNCQdrFvDh97iRM9jVDqgrK1Wby1k';

@Service()
export class PlacesService {
	private autocomplete: google.maps.places.AutocompleteService;
	constructor() {
		this.autocomplete = new google.maps.places.AutocompleteService();
	}

	getPredictions({ searchQuery, location }): Promise<google.maps.places.AutocompletePrediction[]> {
		let latlng, radius;
		if (location) {
			latlng = new google.maps.LatLng({
				lat: location.coords.latitude,
				lng: location.coords.longitude,
			});
			radius = location.coords.accuracy;
		}
		return new Promise((resolve, reject) => {
			this.autocomplete.getPlacePredictions(
				{
					input: searchQuery,
					types: ['geocode'],
					location: latlng,
					radius,
				},
				(searchResults, placesStatus) => {
					if (
						![
							google.maps.places.PlacesServiceStatus.OK,
							google.maps.places.PlacesServiceStatus.NOT_FOUND,
							google.maps.places.PlacesServiceStatus.ZERO_RESULTS,
						].includes(placesStatus)
					) {
						reject();
					} else {
						resolve(searchResults || []);
					}
				}
			);
		});
	}

	getPlacesDetails(placeId) {
		return axios
			.get(`/maps/api/place/details/json`, {
				params: {
					key: API_KEY,
					// eslint-disable-next-line @typescript-eslint/camelcase
					place_id: placeId,
					fields: 'address_component,geometry',
				},
			})
			.then(({ data }) => parseAddress(data));
	}
}

function parseAddress(data) {
	const {
		result: { address_components: addressComponents, geometry },
	} = data;
	const address: AddressDto = {
		street1: '',
		street2: '',
		state: '',
		city: '',
		suburb: '',
		country: '',
		postcode: '',
		lat: null,
		lon: null,
	};
	for (const component of addressComponents) {
		if (component.types.includes('street_number') || component.types.includes('route')) {
			if (address.street1) {
				address.street1 += ' ';
			}
			address.street1 += component.long_name;
		}

		if (component.types.includes('locality')) {
			address.suburb += component.long_name;
		}

		if (component.types.includes('administrative_area_level_2')) {
			address.city += component.short_name;
		}

		if (component.types.includes('country')) {
			address.country += component.long_name;
		}

		if (component.types.includes('administrative_area_level_1')) {
			address.state += component.long_name;
		}

		if (component.types.includes('postal_code')) {
			address.postcode += component.long_name;
		}
	}

	if (geometry && geometry.location) {
		const { lat, lon } = geometry.location;
		address.lat = lat;
		address.lon = lon;
	}

	return address;
}
