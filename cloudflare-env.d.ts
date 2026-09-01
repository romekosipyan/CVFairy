declare global {
  interface CloudflareEnv {
    DB: D1Database;
    R2: R2Bucket;
    KV: KVNamespace;
    AI: Ai;
    ASSETS: Fetcher;
    ENVIRONMENT: string;
    NEXT_PUBLIC_APP_NAME: string;
  }

  namespace NodeJS {
    interface ProcessEnv {
      ENVIRONMENT?: string;
      NEXT_PUBLIC_APP_NAME?: string;
      AUTH_SECRET?: string;
      AUTH_URL?: string;
      AUTH_GOOGLE_ID?: string;
      AUTH_GOOGLE_SECRET?: string;
      AUTH_GITHUB_ID?: string;
      AUTH_GITHUB_SECRET?: string;
      AUTH_RESEND_KEY?: string;
      AUTH_EMAIL_FROM?: string;
    }
  }
}

export {};
