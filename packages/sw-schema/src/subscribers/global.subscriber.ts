import { EntityIds, SwSubscriber } from '@schema/core/subscriber/sql/base.subscriber';
import { EventSubscriber } from 'typeorm';

@EventSubscriber()
export class SwGlobalSubscriber extends SwSubscriber {
	afterSaveEntities(entityIds: EntityIds) {
		super.afterSaveEntities(entityIds);
	}
}
