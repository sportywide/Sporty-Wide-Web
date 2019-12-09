import { error, ok } from '@scheduling/lib/http';
import { initModule, SchedulingCrawlerModule } from '@scheduling/lib/scheduling.module';
import { FifaCrawlerService } from '@data/crawler/fifa-crawler.service';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';
import { parseBody } from '@scheduling/lib/aws/lambda/body-parser';
import { SNSEvent } from 'aws-lambda';

export async function handler(event: SNSEvent) {
	try {
		const leagueId = parseInt(parseBody(event), 10);
		const module = await initModule(SchedulingCrawlerModule);
		const s3Service = module.get(S3Service);
		const config = module.get(SCHEDULING_CONFIG);
		const objectDetails = await s3Service.getObject({
			Bucket: config.get('s3:data_bucket_name'),
			Key: `teams/fifa/${leagueId}.json`,
		});
		const teams = JSON.parse(objectDetails.Body!.toString('utf8'));
		const teamIds = teams.map(team => team.fifaId);
		const fifaCrawler = module.get(FifaCrawlerService);
		const players = await fifaCrawler.crawlPlayersByTeams(teamIds);
		await s3Service.uploadFile({
			Bucket: config.get('s3:data_bucket_name'),
			Key: `players/fifa/${leagueId}.json`,
			Body: JSON.stringify(players),
			Metadata: {
				league: leagueId.toString(),
			},
		});
		return ok('SUCCESS');
	} catch (e) {
		console.error(__filename, e);
		return error(e);
	}
}
