import { error, ok } from '@scheduling/lib/http';
import { initModule, SchedulingCrawlerModule } from '@scheduling/lib/scheduling.module';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';
import { FixtureCrawlerService } from '@data/crawler/fixture-crawler.service';
import { getSeason } from '@shared/lib/utils/season';
import { leagues } from '@data/data.constants';
import { parseBody } from '@scheduling/lib/aws/lambda/body-parser';

export async function handler(event) {
	try {
		const leagueId = parseInt(parseBody(event), 10);
		const module = await initModule(SchedulingCrawlerModule);
		const s3Service = module.get(S3Service);
		const fixtureCrawler = module.get(FixtureCrawlerService);
		const season = getSeason(new Date());
		const league = leagues.find(league => league.id === leagueId);
		if (!league) {
			throw new Error('Not a valid league');
		}
		if (!season) {
			throw new Error('Not in season');
		}
		const matches = await fixtureCrawler.getMatchesForLeague(league, season);
		const config = module.get(SCHEDULING_CONFIG);
		await s3Service.uploadFile({
			Bucket: config.get('s3:data_bucket_name'),
			Key: `fixtures/${leagueId}.json`,
			Body: JSON.stringify({
				id: league.id,
				season: season,
				matches,
			}),
			Metadata: {
				league: leagueId.toString(),
			},
		});
		return ok('SUCCESS');
	} catch (e) {
		console.error(e);
		return error(e);
	}
}