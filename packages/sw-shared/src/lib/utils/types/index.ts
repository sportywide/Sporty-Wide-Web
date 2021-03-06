export type Interface<E> = {
	[k in keyof E]: E[k];
};

export class MongooseDocument {
	_id: any;
	__v: number;
}

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
	baseCtors.forEach(baseCtor => {
		Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
			Object.defineProperty(
				derivedCtor.prototype,
				name,
				Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
			);
		});
	});
}

export type Diff<T, K> = Omit<T, keyof K>;
