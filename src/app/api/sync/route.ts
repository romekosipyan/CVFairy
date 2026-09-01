import { NextResponse } from "next/server";
import { z } from "zod";

import { requireSessionUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import {
  deleteCloudResume,
  listCloudResumes,
  upsertCloudResume,
} from "@/lib/sync/cloud-sync";
import { SyncResumeInput } from "@/lib/sync/types";

const PushBody = z.object({
  resume: SyncResumeInput.optional(),
  resumes: z.array(SyncResumeInput).optional(),
});

export async function GET() {
  const user = await requireSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = await getDb();
    const resumes = await listCloudResumes(db, user.id);
    return NextResponse.json({ resumes });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to list cloud resumes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await requireSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const json: unknown = await request.json();
    const parsed = PushBody.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid sync payload" }, { status: 400 });
    }
    const items = parsed.data.resumes ?? (parsed.data.resume ? [parsed.data.resume] : []);
    if (items.length === 0) {
      return NextResponse.json({ error: "No resumes to sync" }, { status: 400 });
    }
    const db = await getDb();
    const results = [];
    for (const item of items) {
      results.push(await upsertCloudResume(db, user.id, item));
    }
    const conflict = results.find((item) => item.status === "conflict");
    if (conflict) {
      return NextResponse.json(conflict, { status: 409 });
    }
    return NextResponse.json({ results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to sync";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await requireSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  try {
    const db = await getDb();
    const deleted = await deleteCloudResume(db, user.id, id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to unsync";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
