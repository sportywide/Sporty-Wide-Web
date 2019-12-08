import { Expose } from 'class-transformer-imp';

export type Interface<E> = {
	[k in keyof E]: E[k];
};

export class MongooseDocument {
	@Expose()
	_id: any;
	@Expose()
	__v: number;
}

export type Diff<T, K> = Omit<T, keyof K>;
