import { Module } from '@nestjs/common';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';
import { CoreSchedulingModule } from '@scheduling/lib/core/core.module';
import { SqsService } from '@scheduling/lib/aws/sqs/sqs.service';
import { SnsService } from '@scheduling/lib/aws/sns/sns.service';
import { CloudwatchService } from '@scheduling/lib/aws/cloudwatch/cloudwatch.service';

@Module({
	imports: [CoreSchedulingModule],
	providers: [S3Service, SqsService, SnsService, CloudwatchService],
	exports: [S3Service, SqsService, SnsService, CloudwatchService],
})
export class AwsModule {}
