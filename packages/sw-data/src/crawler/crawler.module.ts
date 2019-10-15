import { Module } from '@nestjs/common';
import { CoreDataModule } from '@data/core/core-data.module';
import { TeamPlayerCrawlerService } from '@data/crawler/team-player-crawler.service';
import { FixtureCrawlerService } from '@data/crawler/fixture-crawler.service';

@Module({
	imports: [CoreDataModule],
	exports: [TeamPlayerCrawlerService, FixtureCrawlerService],
	providers: [TeamPlayerCrawlerService, FixtureCrawlerService],
})
export class CrawlerModule {}
