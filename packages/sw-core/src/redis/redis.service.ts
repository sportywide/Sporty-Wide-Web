import Redis from 'ioredis';
import { Inject } from '@nestjs/common';
import { CORE_CONFIG } from '@core/config/config.constants';

export class RedisService {
	client: Redis.Redis;
	constructor(@Inject(CORE_CONFIG) private readonly config) {
		this.client = new Redis({
			port: config.get('redis:port'),
			host: config.get('redis:host'),
		});
	}
}
