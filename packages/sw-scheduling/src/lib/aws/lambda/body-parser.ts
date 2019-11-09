export enum EventSource {
	CLOUDFRONT,
	API_GATEWAY_AUTHORIZER,
	CLOUD_FORMATION,
	SES,
	SQS,
	S3,
	DYNAMODB,
	SNS,
}
export function parseBody(event) {
	const eventSource = getEventSource(event);
	if (eventSource === EventSource.S3) {
		return {
			bucketName: event.Records[0].s3.bucket.name,
			key: event.Records[0].s3.object.key,
		};
	} else if (eventSource === EventSource.SNS) {
		return event.Records[0].Sns.Message;
	} else if (eventSource === EventSource.SQS) {
		return event.Records.map(record => ({
			messageId: record.messageId,
			body: record.test,
		}));
	} else if (event.body) {
		return JSON.parse(event.body);
	}
}

export function getEventSource(event) {
	if (event.Records && event.Records[0].cf) return EventSource.CLOUDFRONT;

	if (event.authorizationToken === 'incoming-client-token') return EventSource.API_GATEWAY_AUTHORIZER;

	if (event.StackId && event.RequestType && event.ResourceType) return EventSource.CLOUD_FORMATION;

	if (event.Records && event.Records[0].eventSource === 'aws:ses') return EventSource.SES;

	if (event.Records && event.Records[0].EventSource === 'aws:sns') return EventSource.SNS;

	if (event.Records && event.Records[0].eventSource === 'aws:dynamodb') return EventSource.DYNAMODB;

	if (event.Records && event.Records[0].eventSource === 'aws:s3') return EventSource.S3;

	if (event.Records && event.Records[0].eventSource === 'aws:sqs') return EventSource.SQS;
}
