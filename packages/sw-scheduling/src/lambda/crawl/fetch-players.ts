import { error, ok } from '@scheduling/lib/http';
import { initModule } from '@scheduling/lib/scheduling.module';
import { FifaCrawlerService } from '@data/crawler/fifa-crawler.service';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';

export async function handler(event) {
	try {
		const bucketName = event.Records[0].s3.bucket.name;
		const key = event.Records[0].s3.object.key;
		const module = await initModule();
		const s3Service = module.get(S3Service);
		const objectDetails = await s3Service.getObject({
			key,
			bucket: bucketName,
		});
		const fifaCrawler = module.get(FifaCrawlerService);
		const leagueId = parseInt((objectDetails.Metadata || {}).league);
		const players = await fifaCrawler.crawlPlayers(leagueId);
		const config = module.get(SCHEDULING_CONFIG);
		await s3Service.uploadFile({
			bucket: config.get('s3:data_bucket_name'),
			key: `players/fifa/${leagueId}.json`,
			body: JSON.stringify(players),
			metadata: {
				league: leagueId.toString(),
			},
		});
		return ok('SUCCESS');
	} catch (e) {
		console.error(e);
		return error(e);
	}
}
