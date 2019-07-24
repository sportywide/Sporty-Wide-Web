import { Module } from '@nestjs/common';
import { User } from '@schema/user/models/user.entity';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [CoreSchemaModule, TypeOrmModule.forFeature([User])],
})
export class SchemaUserModule {}
