import * as path from 'path';
import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { ConfigModule } from '@core/config/config.module';
import { EMAIL_CONFIG } from '@core/config/config.constants';
import { EmailService } from '@email/core/email/email.service';
import { TemplateService } from '@email/core/email/template/template.service';
import { StylesheetService } from '@email/core/email/styles/styles.service';

@Module({
	imports: [
		CoreModule,
		ConfigModule.forRoot({
			configFile: path.resolve(__dirname, 'sw-email', 'config'),

			exportAs: EMAIL_CONFIG,
		}),
	],
	providers: [EmailService, TemplateService, StylesheetService],
	exports: [EmailService, ConfigModule, TemplateService, StylesheetService],
})
export class CoreEmailModule {}
