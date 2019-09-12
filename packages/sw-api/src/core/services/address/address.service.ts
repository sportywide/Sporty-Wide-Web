import { Service } from 'typedi';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { City } from '@schema/address/models/city.entity';
import { State } from '@schema/address/models/state.entity';
import { Country } from '@schema/address/models/country.entity';

@Service({ global: true })
export class AddressService {
	constructor(
		@InjectSwRepository(City) private readonly cityRepository: SwRepository<City>,
		@InjectSwRepository(State) private readonly stateRepository: SwRepository<State>,
		@InjectSwRepository(Country) private readonly countryRepository: SwRepository<Country>
	) {}

	getCountries() {
		return this.countryRepository.find({});
	}

	getStatesFromCountryId(countryId) {
		return this.stateRepository.find({
			where: {
				countryId,
			},
		});
	}

	getCitiesFromStateId(stateId) {
		return this.cityRepository.find({
			where: {
				stateId,
			},
		});
	}
}