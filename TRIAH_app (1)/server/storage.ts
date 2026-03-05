import { eq, and, desc, sql, count } from "drizzle-orm";
import { db } from "./db";
import {
  vendors, evaluationSessions, evaluationScores,
  calibrationExercises, calibrationScores,
  type Vendor, type InsertVendor,
  type EvaluationSession, type InsertEvaluationSession,
  type EvaluationScore, type InsertEvaluationScore,
  type CalibrationExercise, type InsertCalibrationExercise,
  type CalibrationScore, type InsertCalibrationScore,
} from "@shared/schema";

export interface IStorage {
  getVendors(): Promise<Vendor[]>;
  getVendor(id: number): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: number, data: Partial<Vendor>): Promise<Vendor | undefined>;
  deleteAllVendors(): Promise<void>;

  getEvaluationSessions(): Promise<EvaluationSession[]>;
  getEvaluationSession(id: number): Promise<EvaluationSession | undefined>;
  getEvaluationsByVendor(vendorId: number): Promise<EvaluationSession[]>;
  getRecentEvaluations(limit: number): Promise<EvaluationSession[]>;
  createEvaluationSession(session: InsertEvaluationSession): Promise<EvaluationSession>;
  updateEvaluationSession(id: number, data: Partial<EvaluationSession>): Promise<EvaluationSession | undefined>;
  deleteAllEvaluations(): Promise<void>;

  getScoresBySession(sessionId: number): Promise<EvaluationScore[]>;
  upsertScores(scores: InsertEvaluationScore[]): Promise<void>;
  deleteAllScores(): Promise<void>;

  getCalibrationExercises(): Promise<CalibrationExercise[]>;
  getCalibrationExercise(id: number): Promise<CalibrationExercise | undefined>;
  createCalibrationExercise(exercise: InsertCalibrationExercise): Promise<CalibrationExercise>;
  deleteAllCalibrations(): Promise<void>;

  getCalibrationScores(exerciseId: number): Promise<CalibrationScore[]>;
  createCalibrationScores(scores: InsertCalibrationScore[]): Promise<void>;
  deleteAllCalibrationScores(): Promise<void>;

  updateEvaluationStatus(id: number, status: string): Promise<EvaluationSession | undefined>;
  getScoreCountBySession(sessionId: number): Promise<number>;

  getStats(): Promise<any>;
}

class DatabaseStorage implements IStorage {
  async getVendors(): Promise<Vendor[]> {
    return db.select().from(vendors).orderBy(vendors.id);
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor;
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const [created] = await db.insert(vendors).values({
      ...vendor,
      documents: (vendor.documents ?? []) as any,
      evidenceByStandard: (vendor.evidenceByStandard ?? {}) as any,
    }).returning();
    return created;
  }

  async updateVendor(id: number, data: Partial<Vendor>): Promise<Vendor | undefined> {
    const [updated] = await db.update(vendors).set(data).where(eq(vendors.id, id)).returning();
    return updated;
  }

  async deleteAllVendors(): Promise<void> {
    await db.delete(vendors);
  }

  async getEvaluationSessions(): Promise<EvaluationSession[]> {
    return db.select().from(evaluationSessions).orderBy(desc(evaluationSessions.createdAt));
  }

  async getEvaluationSession(id: number): Promise<EvaluationSession | undefined> {
    const [session] = await db.select().from(evaluationSessions).where(eq(evaluationSessions.id, id));
    return session;
  }

  async getEvaluationsByVendor(vendorId: number): Promise<EvaluationSession[]> {
    return db.select().from(evaluationSessions)
      .where(eq(evaluationSessions.vendorId, vendorId))
      .orderBy(desc(evaluationSessions.createdAt));
  }

  async getRecentEvaluations(limit: number): Promise<EvaluationSession[]> {
    return db.select().from(evaluationSessions)
      .orderBy(desc(evaluationSessions.createdAt))
      .limit(limit);
  }

  async createEvaluationSession(session: InsertEvaluationSession): Promise<EvaluationSession> {
    const [created] = await db.insert(evaluationSessions).values(session).returning();
    return created;
  }

  async updateEvaluationSession(id: number, data: Partial<EvaluationSession>): Promise<EvaluationSession | undefined> {
    const [updated] = await db.update(evaluationSessions)
      .set(data)
      .where(eq(evaluationSessions.id, id))
      .returning();
    return updated;
  }

  async deleteAllEvaluations(): Promise<void> {
    await db.delete(evaluationSessions);
  }

  async getScoresBySession(sessionId: number): Promise<EvaluationScore[]> {
    return db.select().from(evaluationScores)
      .where(eq(evaluationScores.sessionId, sessionId));
  }

  async upsertScores(scores: InsertEvaluationScore[]): Promise<void> {
    for (const score of scores) {
      const existing = await db.select().from(evaluationScores)
        .where(and(
          eq(evaluationScores.sessionId, score.sessionId),
          eq(evaluationScores.factorKey, score.factorKey)
        ));

      if (existing.length > 0) {
        await db.update(evaluationScores)
          .set({ score: score.score, notes: score.notes, notApplicable: score.notApplicable ?? false })
          .where(eq(evaluationScores.id, existing[0].id));
      } else {
        await db.insert(evaluationScores).values(score);
      }
    }
  }

  async deleteAllScores(): Promise<void> {
    await db.delete(evaluationScores);
  }

  async getCalibrationExercises(): Promise<CalibrationExercise[]> {
    return db.select().from(calibrationExercises).orderBy(desc(calibrationExercises.createdAt));
  }

  async getCalibrationExercise(id: number): Promise<CalibrationExercise | undefined> {
    const [exercise] = await db.select().from(calibrationExercises).where(eq(calibrationExercises.id, id));
    return exercise;
  }

  async createCalibrationExercise(exercise: InsertCalibrationExercise): Promise<CalibrationExercise> {
    const [created] = await db.insert(calibrationExercises).values({
      ...exercise,
      standardIds: (exercise.standardIds ?? []) as any,
      factorIds: (exercise.factorIds ?? null) as any,
    }).returning();
    return created;
  }

  async deleteAllCalibrations(): Promise<void> {
    await db.delete(calibrationScores);
    await db.delete(calibrationExercises);
  }

  async getCalibrationScores(exerciseId: number): Promise<CalibrationScore[]> {
    return db.select().from(calibrationScores)
      .where(eq(calibrationScores.exerciseId, exerciseId));
  }

  async createCalibrationScores(scores: InsertCalibrationScore[]): Promise<void> {
    if (scores.length > 0) {
      await db.insert(calibrationScores).values(scores);
    }
  }

  async deleteAllCalibrationScores(): Promise<void> {
    await db.delete(calibrationScores);
  }

  async updateEvaluationStatus(id: number, status: string): Promise<EvaluationSession | undefined> {
    const [updated] = await db.update(evaluationSessions)
      .set({ status })
      .where(eq(evaluationSessions.id, id))
      .returning();
    return updated;
  }

  async getScoreCountBySession(sessionId: number): Promise<number> {
    const [result] = await db.select({ count: count() }).from(evaluationScores)
      .where(eq(evaluationScores.sessionId, sessionId));
    return result?.count || 0;
  }

  async getStats(): Promise<any> {
    const [vendorCount] = await db.select({ count: count() }).from(vendors);
    const [evaluationCount] = await db.select({ count: count() }).from(evaluationSessions);
    const completedSessions = await db.select({ count: count() }).from(evaluationSessions)
      .where(eq(evaluationSessions.status, "completed"));
    const [scoreCount] = await db.select({ count: count() }).from(evaluationScores);
    const [calibrationCount] = await db.select({ count: count() }).from(calibrationExercises);

    return {
      vendorCount: vendorCount.count,
      evaluationCount: evaluationCount.count,
      completedCount: completedSessions[0]?.count || 0,
      scoreCount: scoreCount.count,
      calibrationCount: calibrationCount.count,
      totalFactors: 235,
    };
  }
}

export const storage = new DatabaseStorage();
