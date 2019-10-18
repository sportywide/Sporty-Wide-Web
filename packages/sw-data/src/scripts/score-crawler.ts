import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { ScoreCrawlerService } from '@data/crawler/score-crawler.service';
import { format } from 'date-fns';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(CrawlerModule);
	const crawlerService = context.get(ScoreCrawlerService);

	try {
		const date = new Date(2019, 9, 5);
		let matches = await crawlerService.getLiveMatches(date);
		const finishedMatches = matches.filter(match => match.status === 'FT');
		const finishedMatchLinks = finishedMatches.map(match => match.link).filter(link => link);
		const logger = context.get(DATA_LOGGER);
		logger.info(`Getting ratings for ${finishedMatches.length} matches`);
		const ratingMap = await crawlerService.getRatings(finishedMatchLinks);
		matches = matches.map(match => {
			const link = match.link || '';
			if (ratingMap[link]) {
				return {
					...match,
					ratings: ratingMap[link],
				};
			}
			return match;
		});
		await crawlerService.writeResult(`matches/${format(date, 'yyyyMMdd')}.json`, matches);
	} finally {
		await crawlerService.close();
	}
	return context;
}

bootstrap().then(context => {
	const logger = context.get(DATA_LOGGER);
	logger.info('Finished score crawler service');
});
