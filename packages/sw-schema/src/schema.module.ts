import { Module } from '@nestjs/common';
import { SchemaUserModule } from '@schema/user/user.module';
import { CoreSchemaModule } from '@schema/core/core-schema.module';

@Module({
	imports: [SchemaUserModule, CoreSchemaModule],
})
export class SchemaModule {}
