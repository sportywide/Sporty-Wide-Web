import { readConfig } from '@shared/lib/config/config-reader';
import { DynamicModule } from '@nestjs/common';

export class ConfigModule {
	static forRoot({ configFile, exportAs }): DynamicModule {
		const provider = {
			provide: exportAs,
			useValue: readConfig(configFile, process.env.NODE_ENV),
		};
		return {
			module: ConfigModule,
			providers: [provider],
			exports: [provider],
		};
	}
}
