import { Module } from '@nestjs/common';
import { PersisterService } from '@data/persister/persister.service';
import { CoreSchemaModule } from '@schema/core/core-schema.module';

@Module({
	imports: [CoreSchemaModule],
	providers: [PersisterService],
})
export class PersisterModule {}
