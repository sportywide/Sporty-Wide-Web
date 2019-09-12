import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '@schema/address/models/address.entity';

@Module({
	imports: [CoreSchemaModule, TypeOrmModule.forFeature([Address])],
})
export class SchemaAddressModule {}
