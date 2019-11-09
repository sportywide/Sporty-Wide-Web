import { error, ok } from '@scheduling/lib/http';
import { initModule, SchedulingPersisterModule } from '@scheduling/lib/scheduling.module';
import { TeamPersisterService } from '@data/persister/team/team-persister.service';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';
import { SnsService } from '@scheduling/lib/aws/sns/sns.service';
import { parseBody } from '@scheduling/lib/aws/lambda/body-parser';

export async function handler(event) {
	try {
		const { key, bucketName } = parseBody(event);
		const module = await initModule(SchedulingPersisterModule);
		const s3Service = module.get(S3Service);
		const objectDetails = await s3Service.getObject({
			Key: key,
			Bucket: bucketName,
		});
		const teams = JSON.parse(objectDetails.Body!.toString('utf8'));
		const teamPersister = module.get(TeamPersisterService);
		await teamPersister.saveFifaTeams(teams);
		const leagueId = (objectDetails.Metadata || {}).league;
		const snsService = module.get(SnsService);
		await snsService.publish({
			Topic: 'FifaTeamSns',
			Message: leagueId,
		});

		return ok('SUCCESS');
	} catch (e) {
		console.error(e);
		return error(e);
	}
}
