import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppController } from '@api/app.controller';
import { AppService } from '@api/app.service';

describe('AppController', () => {
	let app: INestApplication;
	const appService: AppService = { getHello: () => 'Hello' };
	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService],
		})
			.overrideProvider(AppService)
			.useValue(appService)
			.compile();

		app = module.createNestApplication();
		await app.init();
	});

	it(`/GET hello`, () => {
		return request(app.getHttpServer())
			.get('/hello')
			.set('Accept', 'text/plain')
			.expect('Content-Type', /plain/)
			.expect(200)
			.then(response => {
				expect(response.text).toBe(appService.getHello());
			});
	});

	afterAll(async () => {
		await app.close();
	});
});
