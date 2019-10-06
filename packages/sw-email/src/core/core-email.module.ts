import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { ConfigModule } from '@core/config/config.module';
import { EMAIL_CONFIG } from '@core/config/config.constants';
import { EmailService } from '@email/core/email/email.service';
import { TemplateService } from '@email/core/email/template/template.service';
import { StylesheetService } from '@email/core/email/styles/styles.service';
import { config } from '@email/config';

@Module({
	imports: [
		CoreModule,
		ConfigModule.forRoot({
			config,
			exportAs: EMAIL_CONFIG,
		}),
	],
	providers: [EmailService, TemplateService, StylesheetService],
	exports: [EmailService, ConfigModule, TemplateService, StylesheetService],
})
export class CoreEmailModule {}
