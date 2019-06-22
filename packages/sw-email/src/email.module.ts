import { Module } from '@nestjs/common';
import { CoreEmailModule } from '@email/core/core-email.module';

@Module({
	imports: [CoreEmailModule],
	controllers: [],
})
export class EmailModule {}
