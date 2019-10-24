import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { Address } from '@schema/address/models/address.entity';
import { City } from '@schema/address/models/city.entity';
import { Country } from '@schema/address/models/country.entity';
import { State } from '@schema/address/models/state.entity';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';

@Module({
	imports: [CoreSchemaModule, SwRepositoryModule.forFeature({ entities: [Address, City, Country, State] })],
	exports: [SwRepositoryModule],
})
export class SchemaAddressModule {}
