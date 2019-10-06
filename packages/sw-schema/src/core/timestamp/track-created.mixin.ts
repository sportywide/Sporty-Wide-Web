import { CreateDateColumn } from 'typeorm';
import { Type } from '@nestjs/common';

export function TrackCreated<TBase extends Type<{}>>(Base: TBase) {
	class TrackCreatedMixin extends Base implements HasCreated {
		@CreateDateColumn({ type: 'timestamptz' })
		createdAt: Date;
	}

	return TrackCreatedMixin;
}

export interface HasCreated {
	createdAt: Date;
}
