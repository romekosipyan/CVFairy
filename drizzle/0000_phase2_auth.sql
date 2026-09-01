-- Auth.js tables plus CVFairy cloud resumes (D1 / SQLite)

CREATE TABLE `user` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text,
  `email` text,
  `emailVerified` integer,
  `image` text,
  `tier` text NOT NULL DEFAULT 'free',
  `stripe_customer_id` text,
  `ai_usage_today` integer NOT NULL DEFAULT 0,
  `ai_usage_reset_at` text,
  `created_at` text NOT NULL DEFAULT (datetime('now')),
  `updated_at` text NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);

CREATE TABLE `account` (
  `userId` text NOT NULL,
  `type` text NOT NULL,
  `provider` text NOT NULL,
  `providerAccountId` text NOT NULL,
  `refresh_token` text,
  `access_token` text,
  `expires_at` integer,
  `token_type` text,
  `scope` text,
  `id_token` text,
  `session_state` text,
  PRIMARY KEY (`provider`, `providerAccountId`),
  FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE cascade
);

CREATE TABLE `session` (
  `sessionToken` text PRIMARY KEY NOT NULL,
  `userId` text NOT NULL,
  `expires` integer NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE cascade
);

CREATE TABLE `verificationToken` (
  `identifier` text NOT NULL,
  `token` text NOT NULL,
  `expires` integer NOT NULL,
  PRIMARY KEY (`identifier`, `token`)
);

CREATE TABLE `authenticator` (
  `credentialID` text NOT NULL,
  `userId` text NOT NULL,
  `providerAccountId` text NOT NULL,
  `credentialPublicKey` text NOT NULL,
  `counter` integer NOT NULL,
  `credentialDeviceType` text NOT NULL,
  `credentialBackedUp` integer NOT NULL,
  `transports` text,
  PRIMARY KEY (`userId`, `credentialID`),
  FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE cascade
);

CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);

CREATE TABLE `cloud_resumes` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `title` text NOT NULL,
  `data` text NOT NULL,
  `settings` text NOT NULL,
  `version` integer NOT NULL DEFAULT 1,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE cascade
);

CREATE INDEX `cloud_resumes_user_id_idx` ON `cloud_resumes` (`user_id`);
CREATE INDEX `cloud_resumes_updated_at_idx` ON `cloud_resumes` (`updated_at`);
