import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import * as relations from "./relations";
import * as schema from "./schema";

export async function getCloudflareEnv(): Promise<CloudflareEnv> {
  const { env } = await getCloudflareContext({ async: true });
  return env;
}

export async function getDb() {
  const env = await getCloudflareEnv();
  return drizzle(env.DB, { schema: { ...schema, ...relations } });
}

export type Database = Awaited<ReturnType<typeof getDb>>;
