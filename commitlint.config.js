module.exports = {
	rules: {
		'header-max-length': [1, 'always', 180],
		'scope-empty': [2, 'never'],
		'scope-case': [2, 'always', 'lower-case'],
		'type-case': [2, 'always', 'lower-case'],
		'type-enum': [
			2,
			'always',
			['feat', 'fix', 'refactor', 'perf', 'build', 'ci', 'docs', 'style', 'test', 'revert', 'chore'],
		],
		'type-empty': [2, 'never'],
	},
	parserPreset: {
		parserOpts: {
			headerPattern: /(\w+)\((.+?)\)(?: (.+?))?: (.+)/,
			headerCorrespondence: ['type', 'scope', 'ticket', 'subject'],
		},
	},
};
