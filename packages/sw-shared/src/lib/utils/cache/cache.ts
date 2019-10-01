export class CacheEntry<T> {
	item: T;
	metadata: any;
}
export class SwCache<T> {
	protected cache: Map<string, CacheEntry<T>>;
	readonly capacity: number;

	constructor({ capacity = 10 }) {
		this.cache = new Map<string, CacheEntry<T>>();
		this.capacity = capacity;
	}

	put(key, item) {
		this.cache.set(key, this.getEntry(key, item));
		this.ensureCapacity();
	}

	get(key) {
		const foundEntry = this.cache.get(key);
		if (!foundEntry) {
			return foundEntry;
		}
		const newEntry = this.cacheHit(foundEntry);
		this.cache.set(key, newEntry);
		return newEntry;
	}

	findRemovedKey() {
		const keys = Array.from(this.cache.keys());
		if (!keys.length) {
			return null;
		}
		return keys[Math.floor(Math.random() * keys.length)];
	}

	getEntry(key, item): CacheEntry<T> {
		return {
			item,
			metadata: {},
		};
	}

	cacheHit(cacheEntry: CacheEntry<T>): CacheEntry<T> {
		return cacheEntry;
	}

	private ensureCapacity() {
		if (this.cache.size <= this.capacity) {
			return;
		}
		const keyToRemoved = this.findRemovedKey();
		if (keyToRemoved === null) {
			return;
		}
		this.cache.delete(keyToRemoved);
	}
}
