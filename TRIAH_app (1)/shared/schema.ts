import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, jsonb, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  product: text("product").notNull(),
  description: text("description"),
  evidenceLevel: text("evidence_level").notNull(),
  documentCount: integer("document_count").notNull().default(0),
  vendorDocs: integer("vendor_docs").notNull().default(0),
  governanceDocs: integer("governance_docs").notNull().default(0),
  expectedBadge: text("expected_badge"),
  expectedScoreRange: text("expected_score_range"),
  documents: jsonb("documents").$type<VendorDocument[]>().default([]),
  evidenceByStandard: jsonb("evidence_by_standard").$type<Record<string, string>>().default({}),
  intakeContactEmail: text("intake_contact_email"),
  vendorContactEmail: text("vendor_contact_email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export interface VendorDocument {
  name: string;
  category: string;
  description: string;
  content?: string;
}

export const evaluationSessions = pgTable("evaluation_sessions", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull(),
  evaluatorId: varchar("evaluator_id").notNull(),
  evaluatorName: text("evaluator_name").notNull(),
  standardId: text("standard_id"),
  status: text("status").notNull().default("in_progress"),
  overallScore: real("overall_score"),
  badgeLevel: text("badge_level"),
  mustPassFailed: boolean("must_pass_failed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const evaluationScores = pgTable("evaluation_scores", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  standardKey: text("standard_key").notNull(),
  elementKey: text("element_key").notNull(),
  factorKey: text("factor_key").notNull(),
  score: integer("score").notNull(),
  notes: text("notes"),
  notApplicable: boolean("not_applicable").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const calibrationExercises = pgTable("calibration_exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull().default("spot_check"),
  status: text("status").notNull().default("setup"),
  standardIds: jsonb("standard_ids").$type<string[]>().default([]),
  factorIds: jsonb("factor_ids").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const calibrationScores = pgTable("calibration_scores", {
  id: serial("id").primaryKey(),
  exerciseId: integer("exercise_id").notNull(),
  reviewerId: varchar("reviewer_id").notNull(),
  reviewerName: text("reviewer_name").notNull(),
  factorKey: text("factor_key").notNull(),
  score: integer("score").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vendorsRelations = relations(vendors, ({ many }) => ({
  evaluationSessions: many(evaluationSessions),
}));

export const evaluationSessionsRelations = relations(evaluationSessions, ({ one, many }) => ({
  vendor: one(vendors, { fields: [evaluationSessions.vendorId], references: [vendors.id] }),
  scores: many(evaluationScores),
}));

export const evaluationScoresRelations = relations(evaluationScores, ({ one }) => ({
  session: one(evaluationSessions, { fields: [evaluationScores.sessionId], references: [evaluationSessions.id] }),
}));

export const calibrationExercisesRelations = relations(calibrationExercises, ({ many }) => ({
  scores: many(calibrationScores),
}));

export const calibrationScoresRelations = relations(calibrationScores, ({ one }) => ({
  exercise: one(calibrationExercises, { fields: [calibrationScores.exerciseId], references: [calibrationExercises.id] }),
}));

export const insertVendorSchema = createInsertSchema(vendors).omit({ id: true, createdAt: true });
export const insertEvaluationSessionSchema = createInsertSchema(evaluationSessions).omit({ id: true, createdAt: true, completedAt: true });
export const insertEvaluationScoreSchema = createInsertSchema(evaluationScores).omit({ id: true, createdAt: true });
export const insertCalibrationExerciseSchema = createInsertSchema(calibrationExercises).omit({ id: true, createdAt: true, completedAt: true });
export const insertCalibrationScoreSchema = createInsertSchema(calibrationScores).omit({ id: true, createdAt: true });

export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertEvaluationSession = z.infer<typeof insertEvaluationSessionSchema>;
export type EvaluationSession = typeof evaluationSessions.$inferSelect;
export type InsertEvaluationScore = z.infer<typeof insertEvaluationScoreSchema>;
export type EvaluationScore = typeof evaluationScores.$inferSelect;
export type InsertCalibrationExercise = z.infer<typeof insertCalibrationExerciseSchema>;
export type CalibrationExercise = typeof calibrationExercises.$inferSelect;
export type InsertCalibrationScore = z.infer<typeof insertCalibrationScoreSchema>;
export type CalibrationScore = typeof calibrationScores.$inferSelect;
