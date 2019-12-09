import { error, ok } from '@scheduling/lib/http';

export async function handler() {
	try {
		return ok({
			message: 'OK',
		});
	} catch (e) {
		console.error(__filename, e);
		return error(e);
	}
}
