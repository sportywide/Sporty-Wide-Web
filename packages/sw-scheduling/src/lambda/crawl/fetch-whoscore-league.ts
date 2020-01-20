import { WhoScoreCrawlerService } from '@data/crawler/who-score-crawler.service';
import { INestApplicationContext } from '@nestjs/common';
import { BrowserService } from '@data/crawler/browser.service';
import { error } from '@scheduling/lib/http';
import { getLogger, initModule, SchedulingCrawlerModule } from '@scheduling/lib/scheduling.module';
import { SqsService } from '@scheduling/lib/aws/sqs/sqs.service';

export async function handler() {
	let module: INestApplicationContext;
	try {
		module = await initModule(SchedulingCrawlerModule);
		const crawlerService = module.get(WhoScoreCrawlerService);
		const leagueLinks = await crawlerService.getLeagues();
		const sqsService = module.get(SqsService);
		await Promise.all(
			leagueLinks.map(leagueLink =>
				sqsService.sendMessage({
					Queue: 'whoscore-league-link',
					MessageBody: JSON.stringify(leagueLink),
				})
			)
		);
	} catch (e) {
		const logger = getLogger(module);
		logger.error(__filename, e);
		return error(e);
	} finally {
		const browserService = module.get(BrowserService);
		await browserService.close();
	}
}
