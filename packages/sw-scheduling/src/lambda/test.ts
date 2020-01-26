import { error, ok } from '@scheduling/lib/http';

export async function handler() {
	try {
		return ok({
			message: 'OK',
		});
	} catch (e) {
		return error(e);
	}
}
