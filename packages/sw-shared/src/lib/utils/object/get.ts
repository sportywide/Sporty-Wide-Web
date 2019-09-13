export function safeGet(expression) {
	try {
		return expression();
	} catch (error) {
		if (error instanceof TypeError) return null;
		else throw error;
	}
}