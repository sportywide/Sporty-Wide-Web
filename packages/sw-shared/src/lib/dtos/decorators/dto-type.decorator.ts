export function DtoType(dtoType) {
	return function(target) {
		Reflect.defineMetadata('dto:type', dtoType, target);
	};
}

export function getDtoType(target) {
	if (!target) {
		return null;
	}
	return Reflect.getMetadata('dto:type', target);
}
