import util from 'util';
import { SQS } from 'aws-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { CORE_CONFIG } from '@core/config/config.constants';
import { Provider } from 'nconf';
import { omit } from 'lodash';
import { isDevelopment } from '@shared/lib/utils/env';

@Injectable()
export class SqsService {
	private readonly sqs: SQS;
	private sqsUrl: string;
	constructor(@Inject(CORE_CONFIG) private readonly config: Provider) {
		this.sqs = new SQS({
			endpoint: config.get('sqs:url'),
			region: config.get('aws:region'),
		});
		this.sqsUrl = isDevelopment()
			? `${config.get('sqs:url')}/queue`
			: `https://sqs.${this.config.get('aws:region')}.amazonaws.com/${this.config.get('aws:accountId')}`;
	}

	sendMessage(request: Omit<SQS.Types.SendMessageRequest, 'QueueUrl'> & { Queue: string; QueueUrl?: string }) {
		const sendMessage = util.promisify(this.sqs.sendMessage.bind(this.sqs)) as any;
		return sendMessage({
			...omit(request, ['Queue']),
			QueueUrl: request.Queue ? `${this.sqsUrl}/${request.Queue}` : request.QueueUrl,
		});
	}
}
