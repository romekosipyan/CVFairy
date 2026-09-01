import { relations } from "drizzle-orm";

import { accounts, cloudResumes, sessions, users } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  cloudResumes: many(cloudResumes),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const cloudResumesRelations = relations(cloudResumes, ({ one }) => ({
  user: one(users, {
    fields: [cloudResumes.userId],
    references: [users.id],
  }),
}));
