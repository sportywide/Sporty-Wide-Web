import { DATA_CONFIG } from '@core/config/config.constants';
import { Inject, Injectable } from '@nestjs/common';
import { Provider } from 'nconf';
import { S3Service } from '@core/aws/s3/s3.service';
import { toHashMap } from '@shared/lib/utils/array/transform';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { chunk as lodashChunk } from 'lodash';
import { Logger } from 'log4js';
import { sleep } from '@shared/lib/utils/sleep';

const cloudscraper = require('cloudscraper');

@Injectable()
export class FifaImageService {
	constructor(
		@Inject(DATA_CONFIG) private readonly config: Provider,
		private readonly s3Service: S3Service,
		@Inject(DATA_LOGGER) private readonly logger: Logger
	) {}

	async saveFifaImages(prefix, images = []) {
		const bucketName = this.config.get('s3:asset_bucket');
		const allKeys = (await this.s3Service.allObjects(prefix, bucketName)).map(key =>
			key.substring(prefix.length + 1)
		);
		const keyMap = toHashMap(allKeys);

		for (const chunk of lodashChunk(images, 50)) {
			await Promise.all(
				chunk.map(async image => {
					try {
						const key = image.substring(1);
						if (keyMap[key]) {
							return;
						}
						const body = await cloudscraper.get(`https://www.fifaindex.com${image}`, {
							encoding: null,
						});
						await this.s3Service.uploadFile({
							Key: `${prefix}/${key}`,
							Bucket: bucketName,
							Body: body,
							ContentType: 'image/png',
						});
					} catch (e) {
						this.logger.error(`Failed to fetch image ${image}`, e);
					}
				})
			);
			await sleep(2000);
		}
	}
}
