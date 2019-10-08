import { Module } from '@nestjs/common';
import { CrawlerService } from '@data/crawler/crawler.service';
import { CoreDataModule } from '@data/core/core-data.module';

@Module({
	imports: [CoreDataModule],
	exports: [CrawlerService],
	providers: [CrawlerService],
})
export class CrawlerModule {}
