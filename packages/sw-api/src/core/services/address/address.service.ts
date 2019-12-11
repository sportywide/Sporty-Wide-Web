import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { City } from '@schema/address/models/city.entity';
import { State } from '@schema/address/models/state.entity';
import { Country } from '@schema/address/models/country.entity';
import { Injectable } from '@nestjs/common';
import { BaseEntityService } from '@schema/core/entity/base-entity.service';
import { Address } from '@schema/address/models/address.entity';

@Injectable()
export class AddressService extends BaseEntityService<Address> {
	constructor(
		@InjectSwRepository(City) private readonly cityRepository: SwRepository<City>,
		@InjectSwRepository(Address) private readonly addressRepository: SwRepository<Address>,
		@InjectSwRepository(State) private readonly stateRepository: SwRepository<State>,
		@InjectSwRepository(Country) private readonly countryRepository: SwRepository<Country>
	) {
		super(addressRepository);
	}

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
