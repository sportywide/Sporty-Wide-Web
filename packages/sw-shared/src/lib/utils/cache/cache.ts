import { serialize } from 'class-transformer-imp';

export class CacheEntry<T> {
	item: T;
	metadata: any;
}
export class SwCache<T> {
	protected cache: Map<string, CacheEntry<T>>;
	readonly capacity: number;

	constructor({ capacity = 10 } = {}) {
		this.cache = new Map<string, CacheEntry<T>>();
		this.capacity = capacity;
	}

	put(key: string | object, item: T) {
		this.cache.set(this.getHashKey(key), this.getEntry(key, item));
		this.ensureCapacity();
	}

	get(key: string | object) {
		const hashKey = this.getHashKey(key);
		const foundEntry = this.cache.get(hashKey);
		if (!foundEntry) {
			return foundEntry;
		}
		const newEntry = this.cacheHit(foundEntry);
		this.cache.set(hashKey, newEntry);
		return newEntry;
	}

	protected getHashKey(key: string | object): string {
		let hashKey: any = key;
		if (typeof key === 'object') {
			hashKey = serialize(key);
		}
		return hashKey;
	}

	protected findRemovedKey() {
		const keys = Array.from(this.cache.keys());
		if (!keys.length) {
			return null;
		}
		return keys[Math.floor(Math.random() * keys.length)];
	}

	protected getEntry(key, item): CacheEntry<T> {
		return {
			item,
			metadata: {},
		};
	}

	protected cacheHit(cacheEntry: CacheEntry<T>): CacheEntry<T> {
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
