import type { DefaultSession } from "next-auth";

export type UserTier = "free" | "pro";

declare module "next-auth" {
  interface User {
    tier?: UserTier;
  }

  interface Session {
    user: {
      id: string;
      tier: UserTier;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    tier?: UserTier;
  }
}
