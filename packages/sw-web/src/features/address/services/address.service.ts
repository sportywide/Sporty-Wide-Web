import { Inject, Service } from 'typedi';
import { ApiService } from '@web/shared/lib/http/api.service';
import { map } from 'rxjs/operators';
import { CountryDto } from '@shared/lib/dtos/address/country.dto';
import { Observable } from 'rxjs';
import { StateDto } from '@shared/lib/dtos/address/state.dto';
import { CityDto } from '@shared/lib/dtos/address/city.dto';

@Service({ global: true })
export class AddressService {
	constructor(
		@Inject(type => ApiService)
		private readonly apiService: ApiService
	) {}

	getCountries(): Observable<CountryDto[]> {
		return this.apiService
			.api()
			.get('/address/countries')
			.pipe(map(({ data }) => data));
	}

	getStatesFromCountryId(countryId: number): Observable<StateDto[]> {
		return this.apiService
			.api()
			.get(`/address/countries/${countryId}/states`)
			.pipe(map(({ data }) => data));
	}

	getCititesFromStateId(stateId: number): Observable<CityDto[]> {
		return this.apiService
			.api()
			.get(`/address/states/${stateId}/cities`)
			.pipe(map(({ data }) => data));
	}
}
