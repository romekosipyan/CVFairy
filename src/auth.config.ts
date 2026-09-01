import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

function buildProviders(): NextAuthConfig["providers"] {
  const providers: NextAuthConfig["providers"] = [];
  const googleId = process.env.AUTH_GOOGLE_ID;
  const googleSecret = process.env.AUTH_GOOGLE_SECRET;
  if (googleId && googleSecret) {
    providers.push(Google({ clientId: googleId, clientSecret: googleSecret }));
  }
  const githubId = process.env.AUTH_GITHUB_ID;
  const githubSecret = process.env.AUTH_GITHUB_SECRET;
  if (githubId && githubSecret) {
    providers.push(GitHub({ clientId: githubId, clientSecret: githubSecret }));
  }
  const resendKey = process.env.AUTH_RESEND_KEY;
  const emailFrom = process.env.AUTH_EMAIL_FROM;
  if (resendKey && emailFrom) {
    providers.push(Resend({ apiKey: resendKey, from: emailFrom }));
  }
  return providers;
}

export const authConfig = {
  providers: buildProviders(),
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  trustHost: true,
} satisfies NextAuthConfig;
