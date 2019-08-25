import { UpdateDateColumn, CreateDateColumn } from 'typeorm';
type Constructor<T> = { new (...args: any[]): T };

export function TrackTimestamp<TBase extends Constructor<{}>>(Base: TBase) {
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
