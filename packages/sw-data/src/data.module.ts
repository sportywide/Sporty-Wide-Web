import { Module } from '@nestjs/common';
import { CrawlerModule } from '@data/crawler/crawler.module';

@Module({
	imports: [CrawlerModule],
})
export class DataModule {}
