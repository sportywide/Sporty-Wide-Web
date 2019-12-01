import { LoggerService } from '@nestjs/common';

export class SimpleLoggerService implements LoggerService {
	error(message: any): any {
		console.error(message);
	}

	log(): any {
		//do nothing
	}

	warn(message: any): any {
		console.warn(message);
	}
}
