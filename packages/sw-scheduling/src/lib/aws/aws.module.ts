import { Module } from '@nestjs/common';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';
import { CoreSchedulingModule } from '@scheduling/lib/core/core.module';
import { SqsService } from '@scheduling/lib/aws/sqs/sqs.service';

@Module({
	imports: [CoreSchedulingModule],
	providers: [S3Service, SqsService],
	exports: [S3Service, SqsService],
})
export class AwsModule {}
