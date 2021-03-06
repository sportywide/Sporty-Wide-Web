// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const noop: (arg: any) => any = function(...args) {
	//do nothing
};

export const nothing = function() {
	//do nothing
};

export const wrapDecorator = function(fn) {
	if (fn) {
		return fn;
	}
	return () => noop;
};

export const getArguments = function(func) {
	const args = func.toString().match(/([^(])*\(([^)]*)\)/)[2];

	// Split the arguments string into an array comma delimited.
	return args
		.split(',')
		.map(arg => {
			// Ensure no inline comments are parsed and trim the whitespace.
			return arg.replace(/\/\*.*\*\//, '').trim();
		})
		.filter(function(arg) {
			// Ensure no undefineds are added.
			return arg;
		});
};
