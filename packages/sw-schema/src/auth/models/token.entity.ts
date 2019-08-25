import { Column, Entity } from 'typeorm';
import { TokenType } from '@schema/auth/models/enums/token-type.token';
import { TrackCreated } from '@schema/core/timestamp/track-created.mixin';
import { BaseEntity } from '@schema/core/base.entity';

@Entity({
	name: 'tokens',
})
export class Token extends TrackCreated(BaseEntity) {
	@Column({ type: 'timestamptz' })
	ttl: Date;

	@Column() engagementTable: string;

	@Column() engagementId: number;

	@Column() content: string;

	@Column({
		type: 'enum',
		enum: TokenType,
		default: null,
	})
	type: TokenType;
}
