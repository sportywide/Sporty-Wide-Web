import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import axios from 'axios-observable';
import { fetchCharacterFailure, fetchCharacterSuccess } from '@web/features/home/store/actions';

export const fetchCharacter = (id, isServer?: boolean) =>
	axios.get(`https://swapi.co/api/people/${id}`).pipe(
		map(response => fetchCharacterSuccess(response.data, isServer)),
		catchError(error => {
			return of(fetchCharacterFailure(error.response.data, isServer));
		})
	);
