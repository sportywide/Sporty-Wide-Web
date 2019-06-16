import { Module } from '@nestjs/common';
import { databaseProviders } from '@schema/core/database.provider';
import { SchemaUserModule } from '@schema/user/user.module';

@Module({
	imports: [SchemaUserModule],
	providers: [...databaseProviders],
	exports: [...databaseProviders, SchemaUserModule],
})
export class SchemaModule {}
