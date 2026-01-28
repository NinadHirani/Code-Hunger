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
  collegeId: varchar("college_id"),
  githubToken: text("github_token"),
  replitId: text("replit_id"),
});

export const colleges = pgTable("colleges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  domain: text("domain"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const learningPaths = pgTable("learning_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  image: text("image"),
  problems: json("problems").notNull().default([]), // Array of { problemId: string, order: number }
  createdAt: timestamp("created_at").defaultNow(),
});

export const userLearningPaths = pgTable("user_learning_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  pathId: varchar("path_id").notNull().references(() => learningPaths.id),
  progress: integer("progress").default(0), // percentage
  completed: boolean("completed").default(false),
  lastActivity: timestamp("last_activity").defaultNow(),
});

export const jobSimulations = pgTable("job_simulations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  logo: text("logo"),
  role: text("role").notNull(),
  description: text("description"),
  problemIds: text("problem_ids").array().default([]),
  duration: integer("duration"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCollegeSchema = createInsertSchema(colleges).omit({
  id: true,
  createdAt: true,
});

export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  createdAt: true,
});

export const insertJobSimulationSchema = createInsertSchema(jobSimulations).omit({
  id: true,
  createdAt: true,
});

export type College = typeof colleges.$inferSelect;
export type LearningPath = typeof learningPaths.$inferSelect;
export type UserLearningPath = typeof userLearningPaths.$inferSelect;
export type JobSimulation = typeof jobSimulations.$inferSelect;

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

export const contests = pgTable("contests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  problemIds: text("problem_ids").array().default([]), // Array of problem IDs
  status: text("status").notNull().default("upcoming"), // "upcoming", "ongoing", "finished"
  createdAt: timestamp("created_at").defaultNow(),
});

export const contestParticipants = pgTable("contest_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contestId: varchar("contest_id").notNull().references(() => contests.id),
  userId: varchar("user_id").notNull(), // Can be visitorId or userId
  score: integer("score").default(0),
  rank: integer("rank"),
  submissions: json("submissions").notNull().default([]), // Array of submission objects
  joinedAt: timestamp("joined_at").defaultNow(),
  blockchainHash: text("blockchain_hash"), // For blockchain secured results
});

export const badges = pgTable("badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  criteria: json("criteria").notNull(), // e.g. { type: "solved_count", count: 50 }
});

export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  badgeId: varchar("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const userStreaks = pgTable("user_streaks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastSubmissionAt: timestamp("last_submission_at"),
});

export const rewardPoints = pgTable("reward_points", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  points: integer("points").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const insertContestSchema = createInsertSchema(contests).omit({
  id: true,
  createdAt: true,
});

export const insertContestParticipantSchema = createInsertSchema(contestParticipants).omit({
  id: true,
  joinedAt: true,
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  earnedAt: true,
});

export const insertUserStreakSchema = createInsertSchema(userStreaks).omit({
  id: true,
});

export const insertRewardPointsSchema = createInsertSchema(rewardPoints).omit({
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
export type Contest = typeof contests.$inferSelect;
export type InsertContest = z.infer<typeof insertContestSchema>;
export type ContestParticipant = typeof contestParticipants.$inferSelect;
export type InsertContestParticipant = z.infer<typeof insertContestParticipantSchema>;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type UserStreak = typeof userStreaks.$inferSelect;
export type RewardPoint = typeof rewardPoints.$inferSelect;
