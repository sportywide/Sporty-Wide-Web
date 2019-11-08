import { error, ok } from '@scheduling/lib/http';
import { initModule, SchedulingCrawlerModule } from '@scheduling/lib/scheduling.module';
import { FifaCrawlerService } from '@data/crawler/fifa-crawler.service';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';
import { SqsService } from '@scheduling/lib/aws/sqs/sqs.service';
import { FixtureCrawlerService } from '@data/crawler/fixture-crawler.service';
import { getSeason } from '@shared/lib/utils/season';
import { leagues } from '@data/data.constants';

export async function handler(event) {
	try {
		const bucketName = event.Records[0].s3.bucket.name;
		const key = event.Records[0].s3.object.key;
		const module = await initModule(SchedulingCrawlerModule);
		const s3Service = module.get(S3Service);
		const objectDetails = await s3Service.getObject({
			Key: key,
			Bucket: bucketName,
		});
		const fixtureCrawler = module.get(FixtureCrawlerService);
		const leagueId = parseInt((objectDetails.Metadata || {}).league);
		const season = getSeason(new Date());
		const league = leagues.find(league => league.id === leagueId);
		if (!league) {
			throw new Error('Not a valid league');
		}
		if (!season) {
			throw new Error('Not in season');
		}
		const fixtures = await fixtureCrawler.getMatchesForLeague(league, season);
		const config = module.get(SCHEDULING_CONFIG);
		await s3Service.uploadFile({
			Bucket: config.get('s3:data_bucket_name'),
			Key: `fixtures/${leagueId}.json`,
			Body: JSON.stringify(fixtures),
			Metadata: {
				league: leagueId.toString(),
			},
		});
		const sqsService = module.get(SqsService);
		await sqsService.sendMessage({
			MessageBody: String(leagueId),
			Queue: 'FixtureQueue',
		});
		return ok('SUCCESS');
	} catch (e) {
		console.error(e);
		return error(e);
	}
}
