import { Module } from '@nestjs/common';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { PersisterModule } from '@data/persister/persister.module';
import { CoreDataModule } from '@data/core/core-data.module';
import { DataApiModule } from './api/data-api.module';

@Module({
	imports: [CoreDataModule, CrawlerModule, PersisterModule, DataApiModule],
})
export class DataModule {}
