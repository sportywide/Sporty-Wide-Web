import { Readable } from 'stream';
import util from 'util';
import { S3 } from 'aws-sdk';
import { Injectable, Inject } from '@nestjs/common';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';
import { Provider } from 'nconf';

@Injectable()
export class S3Service {
	private readonly s3: S3;
	constructor(@Inject(SCHEDULING_CONFIG) private readonly config: Provider) {
		this.s3 = new S3({
			s3ForcePathStyle: true,
			accessKeyId: config.get('s3:accessKeyId'),
			secretAccessKey: config.get('s3:secretAccessKey'),
			endpoint: config.get('s3:url'),
		});
	}

	uploadFile({
		key,
		body,
		bucket,
	}: {
		key: string;
		body: Buffer | Uint8Array | Blob | string | Readable;
		bucket: string;
	}) {
		return util.promisify(this.s3.upload.bind(this.s3))({
			Bucket: bucket,
			Key: key,
			Body: body,
		});
	}
}
