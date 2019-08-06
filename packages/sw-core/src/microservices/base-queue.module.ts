import { OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';
import { Logger } from 'log4js';
import { CoreModule } from '@core/core.module';
import { CORE_CONFIG } from '@core/config/config.constants';
import { Provider } from '@root/node_modules/@types/nconf';
import { BullModule } from 'nest-bull';

export class BaseQueueModule implements OnModuleInit {
	constructor(private queue: Queue, private logger: Logger) {}
	onModuleInit(): any {
		this.queue.on('completed', job => {
			this.logger.trace(`${this.getLabel(job)}: Job completed successfully`);
		});

		this.queue.on('failed', (job, err) => {
			this.logger.error(`${this.getLabel(job)}: Error processing job `, err);
		});
	}

	static forRootAsync(name: string) {
		console.log(name);
		return BullModule.forRootAsync({
			name,
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
		});
	}

	private getLabel(job) {
		return `Queue ${this.queue.name} - Processor ${job.name}`;
	}
}
