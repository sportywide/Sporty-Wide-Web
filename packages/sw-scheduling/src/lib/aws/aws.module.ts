import { Module } from '@nestjs/common';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';
import { CoreSchedulingModule } from '@scheduling/lib/core/core.module';

@Module({
	imports: [CoreSchedulingModule],
	providers: [S3Service],
	exports: [S3Service],
})
export class AwsModule {}
