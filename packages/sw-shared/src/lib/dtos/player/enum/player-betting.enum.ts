import { registerEnumType } from '@shared/lib/utils/api/graphql';

export enum PlayerBettingStatus {
	CALCULATING = 'calculating',
	CALCULATED = 'calculated',
	PENDING = 'pending',
}

registerEnumType(PlayerBettingStatus, {
	name: 'PlayerBettingStatus',
});
