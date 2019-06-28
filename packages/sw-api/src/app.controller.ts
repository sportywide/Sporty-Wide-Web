import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiOkResponse, ApiProduces, ApiUseTags } from '@nestjs/swagger';

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
