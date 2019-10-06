import { Module } from '@nestjs/common';
import { CrawlerService } from '@data/crawler/crawler.service';

@Module({
	imports: [],
	exports: [CrawlerService],
	providers: [CrawlerService],
})
export class CrawlerModule {}
