import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Incremental cache / tag cache / queue stay dummy on free tier.
  // Upgrade to R2 + Durable Objects when paid-plan features are needed.
});
