import { NextResponse } from "next/server";
import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

function isProtectedApi(pathname: string): boolean {
  return (
    pathname.startsWith("/api/sync") ||
    pathname.startsWith("/api/ai") ||
    pathname.startsWith("/api/account")
  );
}

export async function proxy(request: NextRequest) {
  if (!isProtectedApi(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/sync/:path*", "/api/ai/:path*", "/api/account/:path*"],
};
