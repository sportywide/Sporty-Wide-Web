import { error, ok } from '@scheduling/lib/http';
import { getLogger, initModule, SchedulingCrawlerModule } from '@scheduling/lib/scheduling.module';
import { SQSEvent } from 'aws-lambda';
import { INestApplicationContext } from '@nestjs/common';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';
import { parseBody } from '@core/aws/lambda/body-parser';
import { S3Service } from '@core/aws/s3/s3.service';
import { chunk as lodashChunk } from 'lodash';
import { sleep } from '@shared/lib/utils/sleep';
import { EspnCrawlerService } from '@data/crawler/espn-crawler.service';
import { EspnTeam } from '@shared/lib/dtos/leagues/league-standings.dto';
import { League } from '@shared/lib/data/data.constants';

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
		const leagueTeams: { league: League; teams: EspnTeam[]; season: string } = JSON.parse(
			objectDetails.Body!.toString('utf8')
		);
		const crawlerService = module.get(EspnCrawlerService);
		const { league, teams, season } = leagueTeams;
		const result = {};
		for (const chunk of lodashChunk(teams, 5)) {
			await Promise.all(
				chunk.map(async team => {
					result[team.name] = await crawlerService.crawlPlayers(team.url, season);
				})
			);
			await sleep(2000);
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
