import { error, ok } from '@scheduling/lib/http';
import { getLogger, initModule, SchedulingCrawlerModule } from '@scheduling/lib/scheduling.module';
import { leagues } from '@shared/lib/data/data.constants';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';
import { ScoreboardCrawlerService } from '@data/crawler/scoreboard-crawler.service';
import { SQSEvent } from 'aws-lambda';
import { INestApplicationContext } from '@nestjs/common';
import { BrowserService } from '@data/crawler/browser.service';
import { parseBody } from '@core/aws/lambda/body-parser';
import { S3Service } from '@core/aws/s3/s3.service';
import { EspnCrawlerService } from '@data/crawler/espn-crawler.service';

export async function handler(event: SQSEvent) {
	let module: INestApplicationContext;
	try {
		const message = parseBody(event);
		const leagueId = parseInt(message[0] && message[0].body, 10);
		module = await initModule(SchedulingCrawlerModule);
		const s3Service = module.get(S3Service);
		const espnCrawler = module.get(EspnCrawlerService);
		const league = leagues.find(league => league.id === leagueId);
		if (!league) {
			throw new Error('Not a valid league');
		}
		const { teams, season } = await espnCrawler.crawlTeams(league.espnUrl);
		const config = module.get(SCHEDULING_CONFIG);
		await s3Service.uploadFile({
			Bucket: config.get('s3:data_bucket_name'),
			Key: `teams/scoreboard/${leagueId}.json`,
			Body: JSON.stringify({
				league,
				teams,
				season,
			}),
			Metadata: {
				league: leagueId.toString(),
			},
		});
		return ok('SUCCESS');
	} catch (e) {
		const logger = getLogger(module);
		logger.error(__filename, e);
		return error(e);
	} finally {
		const browserService = module.get(BrowserService);
		await browserService.close();
	}
}
