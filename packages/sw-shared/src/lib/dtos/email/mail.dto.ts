export class AddressDto {
	name: string;
	address: string;
}

export type Headers =
	| { [key: string]: string | string[] | { prepared: boolean; value: string } }
	| { key: string; value: string }[];

export class AttachmentDto {
	content?: string | Buffer;
	path?: string;
}

export class MailDto {
	from?: string | AddressDto;
	sender?: string | AddressDto;
	to?: string | AddressDto | (string | AddressDto)[];
	cc?: string | AddressDto | (string | AddressDto)[];
	bcc?: string | AddressDto | (string | AddressDto)[];
	replyTo?: string | AddressDto;
	inReplyTo?: string | AddressDto;
	references?: string | string[];
	subject?: string;
	text?: string | Buffer | AttachmentDto;
	html?: string | Buffer | AttachmentDto;
	headers?: Headers;
	attachments?: AttachmentDto[];
	alternatives?: AttachmentDto[];
	messageId?: string;
	date?: Date | string;
	encoding?: string;
	priority?: 'high' | 'normal' | 'low';
}
