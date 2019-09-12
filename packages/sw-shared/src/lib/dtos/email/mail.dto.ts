export class EmailAddressDto {
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
	from?: string | EmailAddressDto;
	sender?: string | EmailAddressDto;
	to?: string | EmailAddressDto | (string | EmailAddressDto)[];
	cc?: string | EmailAddressDto | (string | EmailAddressDto)[];
	bcc?: string | EmailAddressDto | (string | EmailAddressDto)[];
	replyTo?: string | EmailAddressDto;
	inReplyTo?: string | EmailAddressDto;
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
