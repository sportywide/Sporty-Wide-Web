import { error, ok } from '@scheduling/lib/http';
import { initModule, SchedulingPersisterModule } from '@scheduling/lib/scheduling.module';
import { TeamPersisterService } from '@data/persister/team/team-persister.service';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';

export async function handler(event) {
	try {
		const record = event.Records[0];
		const leagueId = parseInt(record.body, 10);
		const module = await initModule(SchedulingPersisterModule);
		const s3Service = module.get(S3Service);
		const config = module.get(SCHEDULING_CONFIG);
		const objectDetails = await s3Service.getObject({
			Key: `teams/fifa/${leagueId}.json`,
			Bucket: config.get('s3:data_bucket_name'),
		});
		const teams = JSON.parse(objectDetails.Body!.toString('utf8'));
		const teamPersister = module.get(TeamPersisterService);
		await teamPersister.saveFifaTeams(teams);

		return ok('SUCCESS');
	} catch (e) {
		console.error(e);
		return error(e);
	}
}
