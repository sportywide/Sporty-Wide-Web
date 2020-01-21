import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';

@Module({
	imports: [CoreSchemaModule],
	exports: [],
})
export class SchemaAuthModule {}
