import { Module } from '@nestjs/common';
import { BullModule } from 'nest-bull';
import config from '@core/config';
import { CoreModule } from '@core/core.module';
import { EmailService } from '@api/email/email.service';

@Module({
	imports: [
		BullModule.forRoot({
			name: 'email',
			options: {
				redis: {
					host: config.get('redis:host'),
					port: config.get('redis:port'),
				},
			},
		}),
		CoreModule,
	],
	exports: [EmailService],
	providers: [EmailService],
})
export class EmailModule {}
