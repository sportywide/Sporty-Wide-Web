import { error, ok } from '@scheduling/lib/http';
import { INestApplicationContext } from '@nestjs/common';
import { getLogger, initModule, SchedulingCrawlerModule } from '@scheduling/lib/scheduling.module';
import { FifaCrawlerService } from '@data/crawler/fifa-crawler.service';
import { leagues } from '@shared/lib/data/data.constants';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';
import { S3Service } from '@core/aws/s3/s3.service';

export async function handler() {
	let module: INestApplicationContext;
	try {
		module = await initModule(SchedulingCrawlerModule);
		const fifaCrawler = module.get(FifaCrawlerService);
		const config = module.get(SCHEDULING_CONFIG);
		const s3Service = module.get(S3Service);
		await Promise.all(
			leagues.map(async league => {
				const teams = await fifaCrawler.crawlTeam(league.id);
				await s3Service.uploadFile({
					Bucket: config.get('s3:data_bucket_name'),
					Key: `teams/fifa/${league.id}.json`,
					Body: JSON.stringify(teams),
					Metadata: {
						league: league.id.toString(),
					},
				});
			})
		);

		return ok('SUCCESS');
	} catch (e) {
		const logger = getLogger(module);
		logger.error(__filename, e);
		return error(e);
	}
}
