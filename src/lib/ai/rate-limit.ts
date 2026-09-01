import { eq, sql } from "drizzle-orm";

import { users } from "@/lib/db/schema";

import type { Database } from "@/lib/db/client";
import type { UserTier } from "@/types/next-auth";

const FREE_DAILY_LIMIT = 5;

export async function consumeAiCredit(
  db: Database,
  userId: string,
  tier: UserTier,
): Promise<{ ok: true } | { ok: false; remaining: number }> {
  if (tier === "pro") {
    return { ok: true };
  }
  const today = new Date().toISOString().slice(0, 10);
  const row = await db.select().from(users).where(eq(users.id, userId)).get();
  if (!row) {
    return { ok: false, remaining: 0 };
  }
  if (row.aiUsageResetAt !== today) {
    await db
      .update(users)
      .set({
        aiUsageToday: 1,
        aiUsageResetAt: today,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId));
    return { ok: true };
  }
  if (row.aiUsageToday >= FREE_DAILY_LIMIT) {
    return { ok: false, remaining: 0 };
  }
  await db
    .update(users)
    .set({
      aiUsageToday: sql`${users.aiUsageToday} + 1`,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(users.id, userId));
  return { ok: true };
}
