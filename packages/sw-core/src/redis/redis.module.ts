import { Module } from '@nestjs/common';
import { RedisService } from '@core/redis/redis.service';
import { CoreConfigModule } from '@core/config/core-config.module';

@Module({
	providers: [RedisService],
	imports: [CoreConfigModule],
	exports: [RedisService],
})
export class RedisModule {}
