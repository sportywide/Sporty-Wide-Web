import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Country } from '@schema/address/models/country.entity';
import { AddressService } from '@api/core/services/address/address.service';
import { toPlain } from '@api/shared/dto/transform';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { State } from '@schema/address/models/state.entity';
import { City } from '@schema/address/models/city.entity';

@Controller('/address')
export class AddressController {
	constructor(private readonly addressService: AddressService) {}

	@UseGuards(JwtAuthGuard)
	@Get('countries')
	public async getCountries(): Promise<Country[]> {
		return toPlain(await this.addressService.getCountries());
	}

	@UseGuards(JwtAuthGuard)
	@Get('countries/:countryId/states')
	public async getStates(@Param('countryId') countryId: number): Promise<State[]> {
		return toPlain(await this.addressService.getStatesFromCountryId(countryId));
	}

	@UseGuards(JwtAuthGuard)
	@Get('states/:stateId/cities')
	public async getCities(@Param('stateId') stateId: number): Promise<City[]> {
		return toPlain(await this.addressService.getCitiesFromStateId(stateId));
	}
}
