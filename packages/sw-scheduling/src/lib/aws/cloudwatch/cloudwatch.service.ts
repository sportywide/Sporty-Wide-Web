import { Inject, Injectable } from '@nestjs/common';
import AWS, { CloudWatchEvents } from 'aws-sdk';
import { toCron } from '@shared/lib/utils/date/conversion';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';

@Injectable()
export class CloudwatchService {
	private cloudwatchEvents: CloudWatchEvents;

	constructor(@Inject(SCHEDULING_CONFIG) private readonly config) {
		this.cloudwatchEvents = new AWS.CloudWatchEvents();
	}

	async putRule({ ruleName, date, lambda }) {
		await this.cloudwatchEvents
			.putRule({
				ScheduleExpression: toCron(date),
				Name: ruleName,
				State: 'ENABLED',
			})
			.promise();
		await this.cloudwatchEvents
			.putTargets({
				Targets: [
					{
						Id: 'lambda-target',
						Arn: `arn:aws:lambda:${this.config.get('aws:region')}:${this.config.get(
							'aws:accountId'
						)}:function:${lambda}`,
					},
				],
				Rule: ruleName,
			})
			.promise();
	}
}
