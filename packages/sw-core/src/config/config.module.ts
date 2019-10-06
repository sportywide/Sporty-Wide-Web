import { createConfig } from '@shared/lib/config/config-reader';
import { DynamicModule } from '@nestjs/common';

export class ConfigModule {
	static forRoot({ config, exportAs }): DynamicModule {
		const provider = {
			provide: exportAs,
			useValue: createConfig(config, process.env.NODE_ENV),
		};
		return {
			module: ConfigModule,
			providers: [provider],
			exports: [provider],
		};
	}
}
