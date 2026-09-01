import { openDB, type IDBPDatabase } from "idb";

export const DB_NAME = "cvfairy";
export const DB_VERSION = 2;
export const KV_STORE = "kv";
export const RESUMES_STORE = "resumes";

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getCvfairyDb(): Promise<IDBPDatabase> | null {
  if (typeof indexedDB === "undefined") {
    return null;
  }
  dbPromise ??= openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(KV_STORE)) {
        database.createObjectStore(KV_STORE);
      }
      if (!database.objectStoreNames.contains(RESUMES_STORE)) {
        const store = database.createObjectStore(RESUMES_STORE, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt");
      }
    },
  });
  return dbPromise;
}
