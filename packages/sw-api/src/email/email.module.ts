import { Module } from '@nestjs/common';
import { BullModule } from 'nest-bull';
import { CoreModule } from '@core/core.module';
import { EmailService } from '@api/email/email.service';
import { EMAIL_QUEUE } from '@core/microservices/queue.constants';
import { Provider } from '@root/node_modules/@types/nconf';
import { CORE_CONFIG } from '@core/config/config.constants';

@Module({
	imports: [
		BullModule.forRootAsync({
			name: EMAIL_QUEUE,
			imports: [CoreModule],
			inject: [CORE_CONFIG],
			useFactory: (coreConfig: Provider) => {
				return {
					options: {
						redis: {
							host: coreConfig.get('redis:host'),
							port: coreConfig.get('redis:port'),
						},
					},
				};
			},
		}),
		CoreModule,
	],
	exports: [EmailService],
	providers: [EmailService],
})
export class EmailModule {}
