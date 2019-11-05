import { ok } from '@scheduling/lib/http';

export async function handler() {
	return ok({
		message: 'OK',
	});
}
