import { NextResponse } from "next/server";

import { AIAction, buildPrompt } from "@/lib/ai/prompts";
import { consumeAiCredit } from "@/lib/ai/rate-limit";
import { requireSessionUser } from "@/lib/auth/session";
import { getCloudflareEnv, getDb } from "@/lib/db/client";

const MODEL = "@cf/meta/llama-3.1-8b-instruct";

export async function POST(request: Request) {
  const user = await requireSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const json: unknown = await request.json();
    const parsed = AIAction.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid AI request" }, { status: 400 });
    }
    const db = await getDb();
    const credit = await consumeAiCredit(db, user.id, user.tier);
    if (!credit.ok) {
      return NextResponse.json(
        { error: "Daily AI limit reached. Try again tomorrow or upgrade." },
        { status: 429 },
      );
    }
    const env = await getCloudflareEnv();
    if (!env.AI) {
      return NextResponse.json({ error: "Workers AI is not configured" }, { status: 503 });
    }
    const prompt = buildPrompt(parsed.data);
    const result: unknown = await env.AI.run(MODEL, {
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user },
      ],
    });
    const content = readAiText(result);
    return NextResponse.json({
      content,
      action: parsed.data.type,
      streaming: false,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function readAiText(result: unknown): string {
  if (typeof result === "string") {
    return result;
  }
  if (typeof result === "object" && result !== null && "response" in result) {
    const response = result.response;
    if (typeof response === "string") {
      return response;
    }
  }
  return "";
}
