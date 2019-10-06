import { Module } from '@nestjs/common';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { PersisterModule } from '@data/persister/persister.module';

@Module({
	imports: [CrawlerModule, PersisterModule],
})
export class DataModule {}
