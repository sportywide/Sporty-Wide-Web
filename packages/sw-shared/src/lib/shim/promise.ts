if (!Promise.prototype.finally) {
	Promise.prototype.finally = function(onFinally) {
		return this.then(
			res => Promise.resolve(onFinally!()).then(() => res),
			err =>
				Promise.resolve(onFinally!()).then(() => {
					throw err;
				})
		);
	};
}
