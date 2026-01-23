import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, json, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const problems = pgTable("problems", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  difficulty: text("difficulty").notNull(), // "Easy", "Medium", "Hard"
  description: text("description").notNull(),
  examples: json("examples").notNull().default([]),
  constraints: text("constraints").array(),
  topics: text("topics").array().default([]),
  acceptance: integer("acceptance").default(0),
  submissions: integer("submissions").default(0),
  accepted: integer("accepted").default(0),
  likes: integer("likes").default(0),
  dislikes: integer("dislikes").default(0),
  starterCode: json("starter_code").notNull().default({}), // { javascript: "", python: "", etc }
  testCases: json("test_cases").notNull().default([]),
  order: integer("order").default(0),
  videoId: text("video_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  problemId: varchar("problem_id").notNull().references(() => problems.id),
  language: text("language").notNull(),
  code: text("code").notNull(),
  status: text("status").notNull(), // "Accepted", "Wrong Answer", "Runtime Error", etc
  passedCount: integer("passed_count").default(0),
  totalCount: integer("total_count").default(0),
  runtime: integer("runtime"),
  memory: integer("memory"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProblems = pgTable("user_problems", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  visitorId: varchar("visitor_id").notNull(),
  problemSlug: text("problem_slug").notNull(),
  liked: boolean("liked").default(false),
  disliked: boolean("disliked").default(false),
  starred: boolean("starred").default(false),
  solved: boolean("solved").default(false),
  attempts: integer("attempts").default(0),
  lastAttemptAt: timestamp("last_attempt_at"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProblemSchema = createInsertSchema(problems).omit({
  id: true,
  createdAt: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true,
});

export const insertUserProblemSchema = createInsertSchema(userProblems).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type Problem = typeof problems.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertUserProblem = z.infer<typeof insertUserProblemSchema>;
export type UserProblem = typeof userProblems.$inferSelect;
