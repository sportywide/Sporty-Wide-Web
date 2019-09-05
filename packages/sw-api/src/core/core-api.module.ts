import path from 'path';
import { Module } from '@nestjs/common';
import { exceptionFilterProvider } from '@api/core/error/exception.provider';
import { CoreModule } from '@core/core.module';
import { ConfigModule } from '@core/config/config.module';
import { API_CONFIG } from '@core/config/config.constants';
import { RequestContextService } from '@api/core/services/request/request-context.service';
import { UtilController } from '@api/core/controllers/util.controller';
import { UniqueService } from '@api/core/services/entity/unique.service';
import { SchemaModule } from '@schema/schema.module';
import { ApiValidationService } from './services/validation/validation.service';

@Module({
	exports: [ApiValidationService, RequestContextService, ConfigModule],
	controllers: [UtilController],
	providers: [exceptionFilterProvider, ApiValidationService, RequestContextService, UniqueService],
	imports: [
		CoreModule,
		SchemaModule,
		ConfigModule.forRoot({
			exportAs: API_CONFIG,
			configFile: path.resolve(__dirname, 'sw-api', 'config'),
		}),
	],
})
export class CoreApiModule {}
