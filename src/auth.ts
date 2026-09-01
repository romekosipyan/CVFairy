import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { authConfig } from "@/auth.config";
import { getDb } from "@/lib/db/client";
import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from "@/lib/db/schema";

import type { UserTier } from "@/types/next-auth";

function readTier(value: unknown): UserTier {
  return value === "pro" ? "pro" : "free";
}

export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  const db = await getDb();
  return {
    ...authConfig,
    adapter: DrizzleAdapter(db, {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
      authenticatorsTable: authenticators,
    }),
    secret: process.env.AUTH_SECRET,
    callbacks: {
      async jwt({ token, user }) {
        if (user?.id) {
          token.id = user.id;
          token.tier = readTier("tier" in user ? user.tier : undefined);
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user && typeof token.id === "string") {
          session.user.id = token.id;
          session.user.tier = readTier(token.tier);
        }
        return session;
      },
    },
  };
});
