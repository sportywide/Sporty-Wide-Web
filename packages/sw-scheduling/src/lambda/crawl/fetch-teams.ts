import { error, ok } from '@scheduling/lib/http';
import { initModule, SchedulingCrawlerModule } from '@scheduling/lib/scheduling.module';
import { FifaCrawlerService } from '@data/crawler/fifa-crawler.service';
import { leagues } from '@data/data.constants';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';

export async function handler() {
	try {
		const module = await initModule(SchedulingCrawlerModule);
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
		console.error(e);
		return error(e);
	}
}
