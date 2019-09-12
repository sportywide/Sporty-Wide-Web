import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '@schema/address/models/address.entity';
import { City } from '@schema/address/models/city.entity';
import { Country } from '@schema/address/models/country.entity';
import { State } from '@schema/address/models/state.entity';

@Module({
	imports: [CoreSchemaModule, TypeOrmModule.forFeature([Address, City, Country, State])],
})
export class SchemaAddressModule {}
