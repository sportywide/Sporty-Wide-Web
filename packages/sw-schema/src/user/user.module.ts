import { Module } from '@nestjs/common';
import { userProviders } from '@schema/user/providers/user.provider';

@Module({
	providers: [...userProviders],
	exports: [...userProviders],
})
export class SchemaUserModule {}
