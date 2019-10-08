import { Module } from '@nestjs/common';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { PersisterModule } from '@data/persister/persister.module';
import { CoreDataModule } from '@data/core/core-data.module';

@Module({
	imports: [CoreDataModule, CrawlerModule, PersisterModule],
})
export class DataModule {}
