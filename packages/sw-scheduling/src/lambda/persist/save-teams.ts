import { error, ok } from '@scheduling/lib/http';
import { initModule } from '@scheduling/lib/scheduling.module';
import { TeamPersisterService } from '@data/persister/team/team-persister.service';

export async function handler(event) {
	try {
		const module = await initModule();
		const fifaCrawler = module.get(TeamPersisterService);

		return ok('SUCCESS');
	} catch (e) {
		console.error(e);
		return error(e);
	}
}
