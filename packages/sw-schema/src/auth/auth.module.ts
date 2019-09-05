import { Module } from '@nestjs/common';
import { Token } from '@schema/auth/models/token.entity';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [CoreSchemaModule, TypeOrmModule.forFeature([Token])],
})
export class SchemaAuthModule {}
