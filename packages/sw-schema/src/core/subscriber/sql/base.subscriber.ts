import { EntitySubscriberInterface, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';

export interface EntityIds {
	tableName: string;
	ids: any[];
}

export interface SwSubscriberInterface {
	afterSaveEntities?(entityIds: EntityIds);

	afterInsertEntities?(entityIds: EntityIds);

	afterUpdateEntities?(entityIds: EntityIds);

	afterRemoveEntities?(entityIds: EntityIds);
}

export class SwSubscriber implements EntitySubscriberInterface<any>, SwSubscriberInterface {
	afterInsertEntities(entityIds: EntityIds) {
		this.afterSaveEntities(entityIds);
	}

	afterUpdateEntities(entityIds: EntityIds) {
		this.afterSaveEntities(entityIds);
	}

	afterRemove(event: RemoveEvent<any>) {
		if (event.entity) {
			this.afterRemoveEntities({ tableName: event.metadata.tableName, ids: [event.entity.id] });
		} else if (event.entityId) {
			this.afterRemoveEntities({ tableName: event.metadata.tableName, ids: [event.entityId] });
		}
	}

	afterInsert(event: InsertEvent<any>) {
		if (event.entity) {
			this.afterInsertEntities({ tableName: event.metadata.tableName, ids: [event.entity.id] });
		}
	}

	afterUpdate(event: UpdateEvent<any>) {
		if (event.entity) {
			this.afterUpdateEntities({ tableName: event.metadata.tableName, ids: [event.entity.id] });
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
	afterSaveEntities(entityIds: EntityIds) {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
	afterRemoveEntities(entityIds: EntityIds) {}
}
