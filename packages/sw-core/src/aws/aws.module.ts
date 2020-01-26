import { Module } from '@nestjs/common';
import { S3Service } from '@core/aws/s3/s3.service';
import { SqsService } from '@core/aws/sqs/sqs.service';
import { SnsService } from '@core/aws/sns/sns.service';
import { CloudwatchService } from '@core/aws/cloudwatch/cloudwatch.service';
import { CoreConfigModule } from '@core/config/core-config.module';

@Module({
	imports: [CoreConfigModule],
	providers: [S3Service, SqsService, SnsService, CloudwatchService],
	exports: [S3Service, SqsService, SnsService, CloudwatchService],
})
export class AwsModule {}
