import { getCvfairyDb, KV_STORE } from "@/lib/storage/indexed-db";

import type { PersistStorage, StorageValue } from "zustand/middleware";
import type { IDBPDatabase } from "idb";

const WRITE_DEBOUNCE_MS = 2000;

type SaveEvents = {
  onSaving: () => void;
  onSaved: () => void;
  onError: (message: string) => void;
};

let saveEvents: SaveEvents | null = null;
let afterSave: (() => void) | null = null;
let writeTimer: ReturnType<typeof setTimeout> | null = null;
let lastWritten = "";
let pendingSerialized = "";

export function bindSaveEvents(events: SaveEvents): void {
  saveEvents = events;
}

export function bindAfterSave(callback: () => void): void {
  afterSave = callback;
}

function parseStored(raw: string): StorageValue<unknown> {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      throw new Error("Corrupt resume storage");
    }
    // PersistStorage.getItem must return StorageValue; JSON.parse is unknown.
    return parsed as StorageValue<unknown>;
  } catch {
    throw new Error("Corrupt resume storage");
  }
}

function memoryStorage(): PersistStorage<unknown> {
  const memory = new Map<string, string>();
  return {
    getItem: (name) => {
      const raw = memory.get(name);
      if (raw === undefined) {
        return null;
      }
      try {
        return parseStored(raw);
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      memory.set(name, JSON.stringify(value));
    },
    removeItem: (name) => {
      memory.delete(name);
    },
  };
}

function flushWrite(db: IDBPDatabase, name: string, serialized: string): void {
  saveEvents?.onSaving();
  void db
    .put(KV_STORE, serialized, name)
    .then(() => {
      lastWritten = serialized;
      saveEvents?.onSaved();
      afterSave?.();
    })
    .catch((error: unknown) => {
      pendingSerialized = "";
      const message =
        error instanceof Error ? error.message : "Failed to save resume";
      saveEvents?.onError(message);
    });
}

function createIndexedDbStorage(): PersistStorage<unknown> {
  return {
    getItem: async (name) => {
      const db = getCvfairyDb();
      if (!db) {
        return null;
      }
      const raw = await (await db).get(KV_STORE, name);
      if (typeof raw !== "string") {
        return null;
      }
      const stored = parseStored(raw);
      lastWritten = raw;
      return stored;
    },
    setItem: (name, value) => {
      const dbHandle = getCvfairyDb();
      if (!dbHandle) {
        return;
      }
      const serialized = JSON.stringify(value);
      if (serialized === lastWritten || serialized === pendingSerialized) {
        return;
      }
      pendingSerialized = serialized;
      if (writeTimer) {
        clearTimeout(writeTimer);
      }
      writeTimer = setTimeout(() => {
        writeTimer = null;
        void dbHandle.then((db) => {
          flushWrite(db, name, serialized);
        });
      }, WRITE_DEBOUNCE_MS);
    },
    removeItem: async (name) => {
      const db = getCvfairyDb();
      if (!db) {
        return;
      }
      if (writeTimer) {
        clearTimeout(writeTimer);
        writeTimer = null;
      }
      lastWritten = "";
      pendingSerialized = "";
      await (await db).delete(KV_STORE, name);
    },
  };
}

export function createResumePersistStorage(): PersistStorage<unknown> {
  if (typeof window === "undefined") {
    return memoryStorage();
  }
  return createIndexedDbStorage();
}
