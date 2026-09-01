import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { accounts, cloudResumes, sessions, users } from "@/lib/db/schema";

export async function DELETE() {
  const user = await requireSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = await getDb();
    await db.batch([
      db.delete(cloudResumes).where(eq(cloudResumes.userId, user.id)),
      db.delete(accounts).where(eq(accounts.userId, user.id)),
      db.delete(sessions).where(eq(sessions.userId, user.id)),
      db.delete(users).where(eq(users.id, user.id)),
    ]);
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
