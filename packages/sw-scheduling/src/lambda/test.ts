import { error, ok } from '@scheduling/lib/http';
import config from '@scheduling/config';

export async function handler() {
	console.info(config.get('test:url'));
	try {
		return ok({
			message: 'OK',
		});
	} catch (e) {
		console.error(e);
		return error(e);
	}
}
