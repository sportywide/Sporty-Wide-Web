export function isASTMatched(a, b) {
	if (typeof b !== 'function') {
		if (b === null || typeof b !== 'object') {
			return a === b;
		} else {
			return a && b && Object.keys(b).every(bKey => isASTMatched(a[bKey], b[bKey]));
		}
	}
	return b(a);
}

export function generate(ast) {
	const escodegen = require('escodegen');
	return escodegen.generate(ast);
}

export function parse(code) {
	const { Parser } = require('acorn');
	return Parser.parse(code);
}
