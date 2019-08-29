import { CreateDateColumn } from 'typeorm';

type Constructor<T> = { new (...args: any[]): T };

export function TrackCreated<TBase extends Constructor<{}>>(Base: TBase) {
	class TrackCreatedMixin extends Base implements HasCreated {
		@CreateDateColumn({ type: 'timestamptz' })
		createdAt: Date;
	}

	return TrackCreatedMixin;
}

export interface HasCreated {
	createdAt: Date;
}
