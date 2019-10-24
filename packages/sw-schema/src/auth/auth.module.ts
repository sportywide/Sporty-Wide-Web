import { Module } from '@nestjs/common';
import { Token } from '@schema/auth/models/token.entity';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';

@Module({
	imports: [CoreSchemaModule, SwRepositoryModule.forFeature({ entities: [Token] })],
	exports: [SwRepositoryModule],
})
export class SchemaAuthModule {}
