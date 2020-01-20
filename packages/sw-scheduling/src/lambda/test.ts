import { error, ok } from '@scheduling/lib/http';
import { getLogger } from '@scheduling/lib/scheduling.module';

export async function handler() {
	try {
		return ok({
			message: 'OK',
		});
	} catch (e) {
		const logger = getLogger(module);
		logger.error(__filename, e);
		return error(e);
	}
}
