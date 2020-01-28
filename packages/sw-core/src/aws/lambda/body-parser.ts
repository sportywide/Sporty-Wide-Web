import { S3Event, SNSEvent, SQSEvent } from 'aws-lambda';

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
type GenericEvent = { body: string };
export function parseBody(event: SNSEvent): string;
export function parseBody(event: SQSEvent): { body: string; messageId: string }[];
export function parseBody(event: S3Event): { bucketName: string; key: string };
export function parseBody(event: GenericEvent): any;
export function parseBody(event: SNSEvent | SQSEvent | S3Event | GenericEvent) {
	const eventSource = getEventSource(event);
	if (eventSource === EventSource.S3) {
		const s3Event = event as S3Event;
		return {
			bucketName: decodeURIComponent(s3Event.Records[0].s3.bucket.name),
			key: decodeURIComponent(s3Event.Records[0].s3.object.key),
		};
	} else if (eventSource === EventSource.SNS) {
		const snsEvent = event as SNSEvent;
		return snsEvent.Records[0].Sns.Message;
	} else if (eventSource === EventSource.SQS) {
		const sqsEvent = event as SQSEvent;
		return sqsEvent.Records.map(record => ({
			messageId: record.messageId,
			body: record.body,
		}));
	} else if ((event as GenericEvent).body) {
		const genericEvent = event as GenericEvent;
		return JSON.parse(genericEvent.body);
	}
}

export function getEventSource(event): EventSource {
	if (event.Records && event.Records[0].cf) return EventSource.CLOUDFRONT;

	if (event.authorizationToken === 'incoming-client-token') return EventSource.API_GATEWAY_AUTHORIZER;

	if (event.StackId && event.RequestType && event.ResourceType) return EventSource.CLOUD_FORMATION;

	if (event.Records && event.Records[0].eventSource === 'aws:ses') return EventSource.SES;

	if (event.Records && event.Records[0].EventSource === 'aws:sns') return EventSource.SNS;

	if (event.Records && event.Records[0].eventSource === 'aws:dynamodb') return EventSource.DYNAMODB;

	if (event.Records && event.Records[0].eventSource === 'aws:s3') return EventSource.S3;

	if (event.Records && event.Records[0].eventSource === 'minio:s3') return EventSource.S3;

	if (event.Records && event.Records[0].eventSource === 'aws:sqs') return EventSource.SQS;
}
