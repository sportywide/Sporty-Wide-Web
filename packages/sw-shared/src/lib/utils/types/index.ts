export type Interface<E> = {
	[k in keyof E]: E[k];
};

export class MongooseDocument {
	_id: any;
	__v: number;
}

export type Diff<T, K> = Omit<T, keyof K>;
