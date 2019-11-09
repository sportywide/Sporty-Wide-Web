import util from 'util';
import { SNS } from 'aws-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';
import { Provider } from 'nconf';
import { omit } from 'lodash';

@Injectable()
export class SnsService {
	private readonly sns: SNS;
	private topicArnPrefix: string;
	constructor(@Inject(SCHEDULING_CONFIG) private readonly config: Provider) {
		this.sns = new SNS({
			endpoint: config.get('sns:url'),
			region: config.get('aws:region'),
		});
		this.topicArnPrefix = `arn:aws:sns:${config.get('aws:region')}:${config.get('aws:accountId')}`;
	}

	publish(request: Omit<SNS.Types.PublishInput, 'TopicArn'> & { Topic: string; TopicArn?: string }) {
		const publish = util.promisify(this.sns.publish.bind(this.sns)) as any;
		return publish({
			...omit(request, ['Topic']),
			TopicArn: request.Topic ? `${this.topicArnPrefix}:${request.Topic}` : request.TopicArn,
		});
	}
}
