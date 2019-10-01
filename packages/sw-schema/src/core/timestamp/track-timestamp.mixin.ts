import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Type } from '@nestjs/common';

export function TrackTimestamp<TBase extends Type<{}>>(Base: TBase) {
	class TrackTimestampEntity extends Base implements HasTimestamp {
		@CreateDateColumn({ type: 'timestamptz' })
		createdAt: Date;

		@UpdateDateColumn({ type: 'timestamptz' })
		updatedAt: Date;
	}

	return TrackTimestampEntity;
}

export interface HasTimestamp {
	createdAt: Date;
}
