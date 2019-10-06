import { CacheEntry, SwCache } from '@shared/lib/utils/cache/cache';
import { minBy } from 'lodash';

export class SwLRUCache<T> extends SwCache<T> {
	cacheHit(cacheEntry): CacheEntry<T> {
		return {
			item: cacheEntry.item,
			metadata: {
				...cacheEntry.metadata,
				hits: (cacheEntry.metadata.hits || 0) + 1,
			},
		};
	}

	getEntry(key, item): CacheEntry<T> {
		return {
			item,
			metadata: {
				hits: 0,
			},
		};
	}

	findRemovedKey(): null | string {
		if (!this.cache.size) {
			return null;
		}
		const lruEntry = minBy(Array.from(this.cache.entries()), ([, entry]) => {
			return entry.metadata.hits;
		});

		if (!lruEntry) {
			return null;
		}

		return lruEntry[0];
	}
}
