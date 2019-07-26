import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProduces, ApiUseTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiUseTags('health')
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@ApiProduces('text/plain')
	@ApiOperation({ title: 'Health check endpoint' })
	@ApiOkResponse({ description: 'Return OK if the web application is still working' })
	@Get('hello')
	getHello(): string {
		return this.appService.getHello();
	}
}
