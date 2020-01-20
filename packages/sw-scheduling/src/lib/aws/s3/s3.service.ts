import util from 'util';
import { S3 } from 'aws-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';
import { Provider } from 'nconf';

@Injectable()
export class S3Service {
	private readonly s3: S3;
	constructor(@Inject(SCHEDULING_CONFIG) private readonly config: Provider) {
		this.s3 = new S3({
			s3ForcePathStyle: true,
			region: config.get('aws:region'),
			accessKeyId: config.get('s3:accessKeyId'),
			secretAccessKey: config.get('s3:secretAccessKey'),
			endpoint: config.get('s3:url'),
		});
	}

	uploadFile(request: S3.Types.PutObjectRequest) {
		return util.promisify(this.s3.upload.bind(this.s3))(request);
	}

	getObject(request: S3.Types.GetObjectRequest): Promise<S3.Types.GetObjectOutput> {
		const getObject = util.promisify(this.s3.getObject.bind(this.s3)) as any;
		return getObject(request);
	}
}
