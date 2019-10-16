import { Module } from '@nestjs/common';
import { ConfigModule } from '@core/config/config.module';
import { config } from '@data/config';
import { DATA_CONFIG } from '@core/config/config.constants';
import { CoreModule } from '@core/core.module';

@Module({
	imports: [
		CoreModule,
		ConfigModule.forRoot({
			config,
			exportAs: DATA_CONFIG,
		}),
	],
	exports: [ConfigModule, CoreModule],
})
export class CoreDataModule {}
