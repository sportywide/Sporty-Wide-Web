export function mergeProps(defaultProps = {}, props = {}) {
	const resultProps = {};
	Object.keys(defaultProps).forEach(key => {
		if (props[key] !== undefined) {
			resultProps[key] = props[key];
		} else {
			resultProps[key] = defaultProps[key];
		}
	});
	return resultProps;
}
