import { WhoScoreCrawlerService } from '@data/crawler/who-score-crawler.service';
import { INestApplicationContext } from '@nestjs/common';
import { BrowserService } from '@data/crawler/browser.service';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';
import { error } from '@scheduling/lib/http';
import { format, startOfMonth } from 'date-fns';
import { getLogger, initModule, SchedulingCrawlerModule } from '@scheduling/lib/scheduling.module';
import { SQSEvent } from 'aws-lambda';
import { S3Service } from '@core/aws/s3/s3.service';
import { parseBody } from '@core/aws/lambda/body-parser';

export async function handler(event: SQSEvent) {
	let module: INestApplicationContext;
	try {
		module = await initModule(SchedulingCrawlerModule);
		const message = parseBody(event);
		const leagueLink = JSON.parse(message[0] && message[0].body);
		const crawlerService = module.get(WhoScoreCrawlerService);
		const s3Service = module.get(S3Service);
		const config = module.get(SCHEDULING_CONFIG);
		const monthName = format(startOfMonth(new Date()), 'MMM');
		const fixtures = await crawlerService.getMonthlyFixtures(leagueLink.link);
		const league = leagueLink.league;
		await s3Service.uploadFile({
			Bucket: config.get('s3:data_bucket_name'),
			Key: `monthly-fixtures/whoscore/${league.id}/${monthName}.json`,
			Body: JSON.stringify(fixtures),
			Metadata: {
				league: String(league.id),
			},
		});
	} catch (e) {
		const logger = getLogger(module);
		logger.error(__filename, e);
		return error(e);
	} finally {
		const browserService = module.get(BrowserService);
		await browserService.close();
	}
}
