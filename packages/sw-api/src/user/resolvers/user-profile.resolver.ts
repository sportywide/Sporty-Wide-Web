import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { toDto } from '@api/utils/dto/transform';
import { UserProfileDto } from '@shared/lib/dtos/user/profile/user-profile.dto';
import { AddressService } from '@api/core/services/address/address.service';
import { AddressDto } from '@shared/lib/dtos/address/address.dto';

@Resolver(() => UserProfileDto)
export class UserProfileResolver {
	constructor(private readonly addressService: AddressService) {}

	@ResolveProperty()
	async address(@Parent() userProfileDto: UserProfileDto) {
		const address = await this.addressService.findIdByDataLoader({
			id: userProfileDto.addressId,
		});
		if (!address) {
			return null;
		}
		return toDto({
			value: address,
			dtoType: AddressDto,
			options: {
				ignoreDecorators: true,
			},
		});
	}
}
