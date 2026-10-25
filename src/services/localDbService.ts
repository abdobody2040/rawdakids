// Local-first storage service for Rawda Kids (B0.1)
// Uses IndexedDB ("rawda" database) with stores: hifz, tasbih, units, stories, rewards, meta
// Keyed per child: [childId, itemId] or composite key `${childId}:${itemId}`
// In-memory fallback if IndexedDB is unavailable or blocked

export type StoreName = 'hifz' | 'tasbih' | 'units' | 'stories' | 'rewards' | 'meta';

export interface LocalRecord<T = any> {
  childId: string;
  itemId: string;
  data: T;
  updatedAt: string; // ISO UTC
  schemaVersion: number;
}

const DB_NAME = 'rawda';
const DB_VERSION = 1;
const STORES: StoreName[] = ['hifz', 'tasbih', 'units', 'stories', 'rewards', 'meta'];

class LocalDbService {
  private memoryStore: Map<string, any> = new Map();
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  public isFallbackMode = false;
  public fallbackNotified = false;

  constructor() {
    this.initDb();
  }

  private initDb(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve) => {
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        this.isFallbackMode = true;
        resolve(null);
        return;
      }

      try {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
          const db = (e.target as IDBOpenDBRequest).result;
          for (const store of STORES) {
            if (!db.objectStoreNames.contains(store)) {
              // Composite key or keyPath [childId, itemId]
              db.createObjectStore(store, { keyPath: ['childId', 'itemId'] });
            }
          }
        };

        req.onsuccess = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          resolve(db);
        };

        req.onerror = () => {
          this.isFallbackMode = true;
          resolve(null);
        };
      } catch {
        this.isFallbackMode = true;
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  private getCompositeKey(store: StoreName, childId: string, itemId: string): string {
    return `${store}:${childId}:${itemId}`;
  }

  /**
   * Get today's local date as "YYYY-MM-DD"
   */
  getLocalDateString(d: Date = new Date()): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Read item from store
   */
  async get<T = any>(store: StoreName, childId: string, itemId: string): Promise<T | null> {
    const db = await this.initDb();
    if (!db || this.isFallbackMode) {
      const rec = this.memoryStore.get(this.getCompositeKey(store, childId, itemId));
      return rec ? (rec.data as T) : null;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(store, 'readonly');
        const req = tx.objectStore(store).get([childId, itemId]);
        req.onsuccess = () => {
          const res = req.result as LocalRecord<T> | undefined;
          resolve(res ? res.data : null);
        };
        req.onerror = () => {
          const rec = this.memoryStore.get(this.getCompositeKey(store, childId, itemId));
          resolve(rec ? (rec.data as T) : null);
        };
      } catch {
        const rec = this.memoryStore.get(this.getCompositeKey(store, childId, itemId));
        resolve(rec ? (rec.data as T) : null);
      }
    });
  }

  /**
   * Save item to store with immediate local update
   */
  async set<T = any>(store: StoreName, childId: string, itemId: string, data: T): Promise<void> {
    const record: LocalRecord<T> = {
      childId,
      itemId,
      data,
      updatedAt: new Date().toISOString(),
      schemaVersion: 1,
    };

    // Always update in-memory cache immediately
    this.memoryStore.set(this.getCompositeKey(store, childId, itemId), record);

    const db = await this.initDb();
    if (!db || this.isFallbackMode) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(store, 'readwrite');
        const req = tx.objectStore(store).put(record);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  /**
   * Get all items for a child in a given store
   */
  async getAllForChild<T = any>(store: StoreName, childId: string): Promise<T[]> {
    const db = await this.initDb();
    if (!db || this.isFallbackMode) {
      const results: T[] = [];
      const prefix = `${store}:${childId}:`;
      for (const [k, v] of this.memoryStore.entries()) {
        if (k.startsWith(prefix)) {
          results.push(v.data as T);
        }
      }
      return results;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(store, 'readonly');
        const req = tx.objectStore(store).openCursor();
        const results: T[] = [];

        req.onsuccess = () => {
          const cursor = req.result;
          if (cursor) {
            const val = cursor.value as LocalRecord<T>;
            if (val.childId === childId) {
              results.push(val.data);
            }
            cursor.continue();
          } else {
            resolve(results);
          }
        };
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  /**
   * Reset store for a specific child (Parent zone feature reset)
   */
  async resetChildStore(store: StoreName, childId: string): Promise<void> {
    const prefix = `${store}:${childId}:`;
    for (const k of Array.from(this.memoryStore.keys())) {
      if (k.startsWith(prefix)) {
        this.memoryStore.delete(k);
      }
    }

    const db = await this.initDb();
    if (!db || this.isFallbackMode) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(store, 'readwrite');
        const req = tx.objectStore(store).openCursor();

        req.onsuccess = () => {
          const cursor = req.result;
          if (cursor) {
            const val = cursor.value as LocalRecord;
            if (val.childId === childId) {
              cursor.delete();
            }
            cursor.continue();
          } else {
            resolve();
          }
        };
        req.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
}

export const localDbService = new LocalDbService();
