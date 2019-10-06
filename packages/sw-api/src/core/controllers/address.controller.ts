import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AddressService } from '@api/core/services/address/address.service';
import { toPlain } from '@api/utils/dto/transform';
import { JwtAuthGuard } from '@api/auth/guards/jwt.guard';
import { StateDto } from '@shared/lib/dtos/address/state.dto';
import { CityDto } from '@shared/lib/dtos/address/city.dto';
import { CountryDto } from '@shared/lib/dtos/address/country.dto';

@Controller('/address')
export class AddressController {
	constructor(private readonly addressService: AddressService) {}

	@UseGuards(JwtAuthGuard)
	@Get('countries')
	public async getCountries(): Promise<CountryDto[]> {
		return toPlain(await this.addressService.getCountries());
	}

	@UseGuards(JwtAuthGuard)
	@Get('countries/:countryId/states')
	public async getStates(@Param('countryId') countryId: number): Promise<StateDto[]> {
		return toPlain(await this.addressService.getStatesFromCountryId(countryId));
	}

	@UseGuards(JwtAuthGuard)
	@Get('states/:stateId/cities')
	public async getCities(@Param('stateId') stateId: number): Promise<CityDto[]> {
		return toPlain(await this.addressService.getCitiesFromStateId(stateId));
	}
}
