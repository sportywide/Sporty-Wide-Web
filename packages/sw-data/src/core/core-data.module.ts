import { Module } from '@nestjs/common';
import { ConfigModule } from '@core/config/config.module';
import { config } from '@data/config';
import { DATA_CONFIG } from '@core/config/config.constants';
import { CoreModule } from '@core/core.module';
import { PuppeteerService } from '@data/core/browser/browser.service';

@Module({
	imports: [
		CoreModule,
		ConfigModule.forRoot({
			config,
			exportAs: DATA_CONFIG,
		}),
	],
	providers: [PuppeteerService],
	exports: [ConfigModule, CoreModule, PuppeteerService],
})
export class CoreDataModule {}
