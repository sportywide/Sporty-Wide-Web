import { error, ok } from '@scheduling/lib/http';
import { getLogger, initModule, SchedulingCrawlerModule } from '@scheduling/lib/scheduling.module';
import { SQSEvent } from 'aws-lambda';
import { INestApplicationContext } from '@nestjs/common';
import { ScoreboardCrawlerService } from '@data/crawler/scoreboard-crawler.service';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';
import { parseBody } from '@core/aws/lambda/body-parser';
import { S3Service } from '@core/aws/s3/s3.service';

export async function handler(event: SQSEvent, context) {
	let module: INestApplicationContext;
	try {
		context.callbackWaitsForEmptyEventLoop = false;
		const [{ body: leagueId }] = parseBody(event);
		module = await initModule(SchedulingCrawlerModule);
		const s3Service = module.get(S3Service);
		const config = module.get(SCHEDULING_CONFIG);
		const objectDetails = await s3Service.getObject({
			Bucket: config.get('s3:data_bucket_name'),
			Key: `teams/scoreboard/${leagueId}.json`,
		});
		const leagueTeams = JSON.parse(objectDetails.Body!.toString('utf8'));
		const scoreboardCrawler = module.get(ScoreboardCrawlerService);
		const { league, teams, season } = leagueTeams;
		const teamUrlMap = await scoreboardCrawler.crawlPlayers(
			teams.map(team => team.url),
			season
		);

		const result = {};
		for (const team of teams) {
			result[team.name] = teamUrlMap[team.url];
		}
		await s3Service.uploadFile({
			Bucket: config.get('s3:data_bucket_name'),
			Key: `players/scoreboard/${league.id}.json`,
			Body: JSON.stringify(result),
			Metadata: {
				league: league.id.toString(),
				season,
			},
		});
		return ok('SUCCESS');
	} catch (e) {
		const logger = getLogger(module);
		logger.error(__filename, e);
		return error(e);
	}
}
