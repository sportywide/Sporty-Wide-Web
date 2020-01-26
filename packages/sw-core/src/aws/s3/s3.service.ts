import util from 'util';
import { S3 } from 'aws-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { CORE_CONFIG } from '@core/config/config.constants';
import { Provider } from 'nconf';

@Injectable()
export class S3Service {
	private readonly s3: S3;
	constructor(@Inject(CORE_CONFIG) private readonly config: Provider) {
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

	async allObjects(prefix, bucketName) {
		const params: S3.Types.ListObjectsV2Request = {
			Bucket: bucketName,
			Prefix: prefix,
		};

		let keys = [];
		while (true) {
			const data = await this.s3.listObjectsV2(params).promise();

			data.Contents.forEach(elem => {
				keys = keys.concat(elem.Key);
			});

			if (!data.IsTruncated) {
				break;
			}
			params.ContinuationToken = data.NextContinuationToken;
		}

		return keys;
	}
}
