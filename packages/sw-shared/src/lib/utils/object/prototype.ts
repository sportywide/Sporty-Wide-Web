export function stripProtoKeys(value: Record<string, any>) {
	delete value.__proto__;
	const keys = Object.keys(value);
	keys.filter(key => typeof value[key] === 'object' && value[key]).forEach(key => stripProtoKeys(value[key]));
}
