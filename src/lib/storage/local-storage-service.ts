import { nanoid } from "nanoid";

import { StoredResume } from "@/lib/schemas";

import { getCvfairyDb, RESUMES_STORE } from "./indexed-db";

const MEMORY_KEY = "cvfairy-resumes";

export interface StorageUsage {
  used: number;
  quota: number;
}

export interface LocalStorageService {
  listResumes(): Promise<StoredResume[]>;
  getResume(id: string): Promise<StoredResume | null>;
  saveResume(resume: StoredResume): Promise<void>;
  deleteResume(id: string): Promise<void>;
  duplicateResume(id: string): Promise<StoredResume>;
  exportAll(): Promise<Blob>;
  importAll(blob: Blob): Promise<number>;
  getStorageUsage(): Promise<StorageUsage>;
}

function parseResume(value: unknown): StoredResume | null {
  const parsed = StoredResume.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function readMemory(): StoredResume[] {
  if (typeof localStorage === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((item) => parseResume(item))
      .filter((item): item is StoredResume => item !== null);
  } catch {
    return [];
  }
}

function writeMemory(resumes: StoredResume[]): void {
  if (typeof localStorage === "undefined") {
    return;
  }
  localStorage.setItem(MEMORY_KEY, JSON.stringify(resumes));
}

function sortByUpdated(resumes: StoredResume[]): StoredResume[] {
  return [...resumes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function listFromIdb(): Promise<StoredResume[] | null> {
  const db = getCvfairyDb();
  if (!db) {
    return null;
  }
  try {
    const rows = await (await db).getAll(RESUMES_STORE);
    return sortByUpdated(
      rows
        .map((row) => parseResume(row))
        .filter((item): item is StoredResume => item !== null),
    );
  } catch {
    return [];
  }
}

export const localStorageService: LocalStorageService = {
  async listResumes() {
    const fromIdb = await listFromIdb();
    if (fromIdb) {
      return fromIdb;
    }
    return sortByUpdated(readMemory());
  },

  async getResume(id) {
    const db = getCvfairyDb();
    if (db) {
      try {
        return parseResume(await (await db).get(RESUMES_STORE, id));
      } catch {
        return null;
      }
    }
    return readMemory().find((item) => item.id === id) ?? null;
  },

  async saveResume(resume) {
    const parsed = StoredResume.parse(resume);
    const db = getCvfairyDb();
    if (db) {
      await (await db).put(RESUMES_STORE, parsed);
      return;
    }
    const next = readMemory().filter((item) => item.id !== parsed.id);
    next.push(parsed);
    writeMemory(next);
  },

  async deleteResume(id) {
    const db = getCvfairyDb();
    if (db) {
      await (await db).delete(RESUMES_STORE, id);
      return;
    }
    writeMemory(readMemory().filter((item) => item.id !== id));
  },

  async duplicateResume(id) {
    const source = await localStorageService.getResume(id);
    if (!source) {
      throw new Error("Resume not found");
    }
    const copy: StoredResume = {
      ...source,
      id: nanoid(),
      title: `${source.title} copy`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncedAt: undefined,
    };
    await localStorageService.saveResume(copy);
    return copy;
  },

  async exportAll() {
    const resumes = await localStorageService.listResumes();
    return new Blob([JSON.stringify(resumes, null, 2)], {
      type: "application/json",
    });
  },

  async importAll(blob) {
    const text = await blob.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("Backup file is not valid JSON");
    }
    const items = Array.isArray(parsed) ? parsed : [parsed];
    const existing = await localStorageService.listResumes();
    const existingIds = new Set(existing.map((item) => item.id));
    let imported = 0;
    for (const item of items) {
      const resume = parseResume(item);
      if (!resume) {
        continue;
      }
      const next =
        existingIds.has(resume.id)
          ? { ...resume, id: nanoid(), title: `${resume.title} imported` }
          : resume;
      await localStorageService.saveResume(next);
      existingIds.add(next.id);
      imported += 1;
    }
    return imported;
  },

  async getStorageUsage() {
    if (typeof navigator === "undefined" || !navigator.storage?.estimate) {
      return { used: 0, quota: 0 };
    }
    try {
      const estimate = await navigator.storage.estimate();
      return { used: estimate.usage ?? 0, quota: estimate.quota ?? 0 };
    } catch {
      return { used: 0, quota: 0 };
    }
  },
};
