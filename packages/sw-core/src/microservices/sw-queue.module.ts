import { CoreModule } from '@core/core.module';
import { CORE_CONFIG } from '@core/config/config.constants';
import { Provider } from 'nconf';
import { BullModule } from 'nest-bull';

export class SwQueueModule {
	static forRootAsync(queues: string[]) {
		return BullModule.forRootAsync(
			queues.map(queue => ({
				name: queue,
				imports: [CoreModule],
				inject: [CORE_CONFIG],
				useFactory: (coreConfig: Provider) => {
					return {
						name: queue,
						options: {
							redis: {
								host: coreConfig.get('redis:host'),
								port: coreConfig.get('redis:port'),
							},
						},
					};
				},
			}))
		);
	}
}
