import { Module } from '@nestjs/common';
import { CrawlerService } from '@data/crawler/crawler.service';

@Module({
	imports: [],
	providers: [CrawlerService],
})
export class CrawlerModule {}
