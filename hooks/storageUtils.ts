// hooks/storageUtils.ts
export const isBrowser = typeof window !== 'undefined';

export const storage = {
	get: (key: string, type: 'local' | 'session' = 'local') => {
		if (!isBrowser) return null;
		const store = type === 'local' ? localStorage : sessionStorage;
		try {
			const value = store.getItem(key);
			return value ? JSON.parse(value) : null;
		} catch {
			return null;
		}
	},

	set: (key: string, value: any, type: 'local' | 'session' = 'local') => {
		if (!isBrowser) return;
		const store = type === 'local' ? localStorage : sessionStorage;
		try {
			store.setItem(key, JSON.stringify(value));
		} catch (err) {
			console.warn(`[Storage] Failed to set ${key}:`, err);
		}
	},

	remove: (key: string, type: 'local' | 'session' = 'local') => {
		if (!isBrowser) return;
		const store = type === 'local' ? localStorage : sessionStorage;
		try {
			store.removeItem(key);
		} catch (err) {
			console.warn(`[Storage] Failed to remove ${key}:`, err);
		}
	},

	has: (key: string, type: 'local' | 'session' = 'local'): boolean => {
		if (!isBrowser) return false;
		const store = type === 'local' ? localStorage : sessionStorage;
		try {
			return store.getItem(key) !== null;
		} catch {
			return false;
		}
	},
};

// IndexedDB handler
export const indexedDBStore = {
	dbName: 'app_state_db',
	storeName: 'states',

	openDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			if (!isBrowser) return reject('SSR');
			const request = indexedDB.open(this.dbName, 1);
			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains(this.storeName)) {
					db.createObjectStore(this.storeName);
				}
			};
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	},

	async get(key: string) {
		try {
			const db = await this.openDB();
			return new Promise<any>((resolve, reject) => {
				const tx = db.transaction(this.storeName, 'readonly');
				const store = tx.objectStore(this.storeName);
				const request = store.get(key);
				request.onsuccess = () => resolve(request.result ?? null);
				request.onerror = () => reject(request.error);
			});
		} catch {
			return null;
		}
	},

	async set(key: string, value: any) {
		try {
			const db = await this.openDB();
			return new Promise<void>((resolve, reject) => {
				const tx = db.transaction(this.storeName, 'readwrite');
				const store = tx.objectStore(this.storeName);
				const request = store.put(value, key);
				request.onsuccess = () => resolve();
				request.onerror = () => reject(request.error);
			});
		} catch (err) {
			console.warn('[IndexedDB] Set failed:', err);
		}
	},

	async has(key: string): Promise<boolean> {
		try {
			const db = await this.openDB();
			return new Promise<boolean>((resolve, reject) => {
				const tx = db.transaction(this.storeName, 'readonly');
				const store = tx.objectStore(this.storeName);
				const request = store.getKey(key);
				request.onsuccess = () => resolve(request.result !== undefined);
				request.onerror = () => reject(false);
			});
		} catch {
			return false;
		}
	},
};
