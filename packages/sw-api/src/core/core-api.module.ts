import { Module } from '@nestjs/common';
import { exceptionFilterProvider } from '@api/core/error/exception.provider';
import { CoreModule } from '@core/core.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@core/config/config.module';
import { API_CONFIG } from '@core/config/config.constants';
import { RequestContextService } from '@api/core/services/request/request-context.service';
import { UtilController } from '@api/core/controllers/util.controller';
import { UniqueService } from '@api/core/services/entity/unique.service';
import { SchemaModule } from '@schema/schema.module';
import { AddressService } from '@api/core/services/address/address.service';
import { AddressController } from '@api/core/controllers/address.controller';
import { isDevelopment } from '@shared/lib/utils/env';
import { config } from '@api/config';
import { ApiValidationService } from './services/validation/validation.service';

@Module({
	exports: [ApiValidationService, RequestContextService, ConfigModule, AddressService],
	controllers: [UtilController, AddressController],
	providers: [exceptionFilterProvider, ApiValidationService, RequestContextService, UniqueService, AddressService],
	imports: [
		CoreModule,
		SchemaModule,
		ConfigModule.forRoot({
			exportAs: API_CONFIG,
			config,
		}),
		GraphQLModule.forRoot({
			autoSchemaFile: isDevelopment() ? '../../schema.graphql' : 'schema.graphql',
			playground: isDevelopment(),
			debug: isDevelopment(),
			context: ({ req, res }) => ({ req, res }),
		}),
	],
})
export class CoreApiModule {}
