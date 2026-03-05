import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getStandards, getStandardsSummary, computeWeightedScore, computeIRR } from "./standards-service";
import { MOCK_VENDORS } from "./seed-data";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import fs from "fs";
import path from "path";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get("/api/standards", async (_req, res) => {
    try {
      const standards = await getStandards();
      const totalFactors = standards.reduce(
        (s, std) => s + std.elements.reduce((se, e) => se + e.factors.length, 0), 0
      );
      res.json({ standards, totalFactors });
    } catch (error) {
      console.error("Error fetching standards:", error);
      res.status(500).json({ message: "Failed to fetch standards" });
    }
  });

  app.get("/api/standards/summary", async (_req, res) => {
    try {
      const standards = await getStandards();
      res.json(getStandardsSummary(standards));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch standards summary" });
    }
  });

  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/vendors", async (_req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.get("/api/vendors/:id", async (req, res) => {
    try {
      const vendor = await storage.getVendor(parseInt(req.params.id));
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });
      res.json(vendor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendor" });
    }
  });

  app.patch("/api/vendors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { intakeContactEmail, vendorContactEmail } = req.body;
      const updated = await storage.updateVendor(id, { intakeContactEmail, vendorContactEmail });
      if (!updated) return res.status(404).json({ message: "Vendor not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update vendor" });
    }
  });

  app.get("/api/vendors/:id/evaluations", async (req, res) => {
    try {
      const sessions = await storage.getEvaluationsByVendor(parseInt(req.params.id));
      const vendors = await storage.getVendors();
      const enriched = sessions.map((s) => {
        const v = vendors.find((v) => v.id === s.vendorId);
        return { ...s, vendorName: v?.name || `Vendor #${s.vendorId}` };
      });
      res.json(enriched);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendor evaluations" });
    }
  });

  app.get("/api/evaluations", async (_req, res) => {
    try {
      const sessions = await storage.getEvaluationSessions();
      const vendors = await storage.getVendors();
      const enriched = await Promise.all(sessions.map(async (s) => {
        const v = vendors.find((v) => v.id === s.vendorId);
        const scoreCount = await storage.getScoreCountBySession(s.id);
        return { ...s, vendorName: v?.name || `Vendor #${s.vendorId}`, scoreCount, documentCount: v?.documentCount || 0 };
      }));
      res.json(enriched);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch evaluations" });
    }
  });

  app.get("/api/evaluations/recent", async (_req, res) => {
    try {
      const sessions = await storage.getRecentEvaluations(5);
      const vendors = await storage.getVendors();
      const enriched = sessions.map((s) => {
        const v = vendors.find((v) => v.id === s.vendorId);
        return { ...s, vendorName: v?.name || `Vendor #${s.vendorId}` };
      });
      res.json(enriched);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent evaluations" });
    }
  });

  app.get("/api/evaluations/:id", async (req, res) => {
    try {
      const session = await storage.getEvaluationSession(parseInt(req.params.id));
      if (!session) return res.status(404).json({ message: "Evaluation not found" });
      const vendor = await storage.getVendor(session.vendorId);
      const scoreCount = await storage.getScoreCountBySession(session.id);
      res.json({
        ...session,
        vendorName: vendor?.name || `Vendor #${session.vendorId}`,
        documents: vendor?.documents || [],
        evidenceByStandard: vendor?.evidenceByStandard || {},
        intakeContactEmail: vendor?.intakeContactEmail || null,
        vendorContactEmail: vendor?.vendorContactEmail || null,
        scoreCount,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch evaluation" });
    }
  });

  app.post("/api/evaluations", async (req, res) => {
    try {
      const session = await storage.createEvaluationSession(req.body);
      res.json(session);
    } catch (error) {
      console.error("Error creating evaluation:", error);
      res.status(500).json({ message: "Failed to create evaluation" });
    }
  });

  app.get("/api/evaluations/:id/scores", async (req, res) => {
    try {
      const scores = await storage.getScoresBySession(parseInt(req.params.id));
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scores" });
    }
  });

  app.post("/api/evaluations/:id/scores", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const { scores } = req.body;
      const dbScores = scores.map((s: any) => ({
        sessionId,
        standardKey: s.standardKey,
        elementKey: s.elementKey,
        factorKey: s.factorKey,
        score: s.score,
        notes: s.notes || null,
        notApplicable: s.notApplicable ?? false,
      }));
      await storage.upsertScores(dbScores);
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving scores:", error);
      res.status(500).json({ message: "Failed to save scores" });
    }
  });

  app.post("/api/evaluations/:id/finalize", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const session = await storage.getEvaluationSession(sessionId);
      if (!session) return res.status(404).json({ message: "Not found" });

      const scores = await storage.getScoresBySession(sessionId);
      const standards = await getStandards();

      const relevantStandards = session.standardId
        ? standards.filter((s) => s.id === session.standardId)
        : standards;

      const result = computeWeightedScore(
        scores.map((s) => ({
          factorKey: s.factorKey,
          elementKey: s.elementKey,
          standardKey: s.standardKey,
          score: s.score,
          notApplicable: s.notApplicable ?? false,
        })),
        relevantStandards
      );

      const updated = await storage.updateEvaluationSession(sessionId, {
        status: "completed",
        overallScore: result.overallScore,
        badgeLevel: result.badgeLevel,
        mustPassFailed: result.mustPassFailed,
        completedAt: new Date(),
      });

      res.json(updated);
    } catch (error) {
      console.error("Error finalizing:", error);
      res.status(500).json({ message: "Failed to finalize" });
    }
  });

  app.patch("/api/evaluations/:id/status", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const { status } = req.body;
      if (!["in_progress", "stopped", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const updated = await storage.updateEvaluationStatus(sessionId, status);
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  app.get("/api/calibrations", async (_req, res) => {
    try {
      const exercises = await storage.getCalibrationExercises();
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calibrations" });
    }
  });

  app.get("/api/calibrations/:id", async (req, res) => {
    try {
      const exercise = await storage.getCalibrationExercise(parseInt(req.params.id));
      if (!exercise) return res.status(404).json({ message: "Not found" });
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calibration" });
    }
  });

  app.post("/api/calibrations", async (req, res) => {
    try {
      const exercise = await storage.createCalibrationExercise(req.body);
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Failed to create calibration" });
    }
  });

  app.get("/api/calibrations/:id/scores", async (req, res) => {
    try {
      const scores = await storage.getCalibrationScores(parseInt(req.params.id));
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calibration scores" });
    }
  });

  app.post("/api/calibrations/:id/scores", async (req, res) => {
    try {
      const exerciseId = parseInt(req.params.id);
      const { reviewerId, reviewerName, scores } = req.body;
      const dbScores = scores.map((s: any) => ({
        exerciseId,
        reviewerId,
        reviewerName,
        factorKey: s.factorKey,
        score: s.score,
        notes: s.notes || null,
      }));
      await storage.createCalibrationScores(dbScores);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to save calibration scores" });
    }
  });

  app.get("/api/calibrations/:id/irr", async (req, res) => {
    try {
      const scores = await storage.getCalibrationScores(parseInt(req.params.id));
      const result = computeIRR(
        scores.map((s) => ({
          reviewerId: s.reviewerId,
          factorKey: s.factorKey,
          score: s.score,
        }))
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to compute IRR" });
    }
  });

  const TEST_EVALUATOR_NAMES = new Set(["Test Evaluator"]);

  app.get("/api/results", async (_req, res) => {
    try {
      const vendors = await storage.getVendors();
      const allSessions = await storage.getEvaluationSessions();
      const sessions = allSessions.filter((s) => !TEST_EVALUATOR_NAMES.has(s.evaluatorName));
      const standards = await getStandards();
      const results: any[] = [];

      for (const vendor of vendors) {
        const vendorSessions = sessions.filter(
          (s) => s.vendorId === vendor.id && s.status === "completed"
        );
        if (vendorSessions.length === 0) continue;

        const allScores: any[] = [];
        for (const session of vendorSessions) {
          const scores = await storage.getScoresBySession(session.id);
          allScores.push(...scores);
        }

        if (allScores.length === 0) continue;

        const factorAverages = new Map<string, { sum: number; count: number; elementKey: string; standardKey: string }>();
        for (const s of allScores) {
          const key = s.factorKey;
          const existing = factorAverages.get(key) || { sum: 0, count: 0, elementKey: s.elementKey, standardKey: s.standardKey };
          existing.sum += s.score;
          existing.count++;
          factorAverages.set(key, existing);
        }

        const avgScores = Array.from(factorAverages.entries()).map(([fk, v]) => ({
          factorKey: fk,
          elementKey: v.elementKey,
          standardKey: v.standardKey,
          score: v.sum / v.count,
        }));

        const result = computeWeightedScore(avgScores, standards);
        const evaluatorIds = new Set(vendorSessions.map((s) => s.evaluatorId));

        results.push({
          vendorId: vendor.id,
          vendorName: vendor.name,
          evaluationCount: vendorSessions.length,
          evaluatorCount: evaluatorIds.size,
          ...result,
        });
      }

      res.json(results);
    } catch (error) {
      console.error("Error computing results:", error);
      res.status(500).json({ message: "Failed to compute results" });
    }
  });

  app.get("/api/results/irr", async (_req, res) => {
    try {
      const allSessions = await storage.getEvaluationSessions();
      const completedSessions = allSessions.filter(
        (s) => s.status === "completed" && !TEST_EVALUATOR_NAMES.has(s.evaluatorName)
      );

      if (completedSessions.length < 2) {
        return res.json(null);
      }

      const allScores: Array<{ reviewerId: string; factorKey: string; score: number; standardKey: string }> = [];
      for (const session of completedSessions) {
        const scores = await storage.getScoresBySession(session.id);
        allScores.push(
          ...scores.map((s) => ({
            reviewerId: session.evaluatorId,
            factorKey: s.factorKey,
            score: s.score,
            standardKey: s.standardKey,
          }))
        );
      }

      const overall = computeIRR(allScores);

      const byStandard: Record<string, any> = {};
      const stdIds = Array.from(new Set(allScores.map((s) => s.standardKey)));
      for (const stdId of stdIds) {
        const stdScores = allScores.filter((s) => s.standardKey === stdId);
        byStandard[stdId] = computeIRR(stdScores);
      }

      res.json({ ...overall, byStandard });
    } catch (error) {
      res.status(500).json({ message: "Failed to compute IRR" });
    }
  });

  app.post("/api/admin/seed", async (_req, res) => {
    try {
      const existingVendors = await storage.getVendors();
      if (existingVendors.length > 0) {
        return res.json({ message: "Vendors already seeded", count: existingVendors.length });
      }

      for (const vendor of MOCK_VENDORS) {
        await storage.createVendor(vendor);
      }
      res.json({ message: "Seeded 3 mock vendors", count: 3 });
    } catch (error) {
      console.error("Error seeding:", error);
      res.status(500).json({ message: "Failed to seed data" });
    }
  });

  app.post("/api/admin/reseed", async (_req, res) => {
    try {
      await storage.deleteAllCalibrationScores();
      await storage.deleteAllCalibrations();
      await storage.deleteAllScores();
      await storage.deleteAllEvaluations();
      await storage.deleteAllVendors();
      for (const vendor of MOCK_VENDORS) {
        await storage.createVendor(vendor);
      }
      res.json({ message: `Re-seeded ${MOCK_VENDORS.length} mock vendors with updated content`, count: MOCK_VENDORS.length });
    } catch (error) {
      console.error("Error reseeding:", error);
      res.status(500).json({ message: "Failed to reseed" });
    }
  });

  app.post("/api/admin/seed-missing", async (_req, res) => {
    try {
      const existingVendors = await storage.getVendors();
      const existingNames = new Set(existingVendors.map((v) => v.name));
      const missing = MOCK_VENDORS.filter((v) => !existingNames.has(v.name));
      for (const vendor of missing) {
        await storage.createVendor(vendor);
      }
      res.json({
        message: missing.length > 0
          ? `Added ${missing.length} new vendor(s): ${missing.map((v) => v.name).join(", ")}`
          : "All vendors already present — nothing added",
        added: missing.length,
        vendors: missing.map((v) => v.name),
      });
    } catch (error) {
      console.error("Error seeding missing vendors:", error);
      res.status(500).json({ message: "Failed to seed missing vendors" });
    }
  });

  app.post("/api/admin/seed-evaluators", async (_req, res) => {
    try {
      const standards = await getStandards();
      const vendors = await storage.getVendors();
      const aidoc = vendors.find((v) => v.name === "Aidoc BriefCase");
      if (!aidoc) return res.status(404).json({ message: "Aidoc BriefCase vendor not found — seed vendors first" });

      const existingSessions = await storage.getEvaluationSessions();
      const alreadySeeded = existingSessions.some(
        (s) => s.evaluatorId === "sandeep-patel-s5" || s.evaluatorId === "michael-chen-s8"
      );
      if (alreadySeeded) {
        return res.json({ message: "Sandeep and Michael already seeded — no changes made", added: 0 });
      }

      const sandeepScoreData: Array<{ factorKey: string; elementKey: string; standardKey: string; score: number }> = [
        { factorKey: "S5.E1.F1", elementKey: "S5.E1", standardKey: "S5", score: 50 },
        { factorKey: "S5.E1.F2", elementKey: "S5.E1", standardKey: "S5", score: 20 },
        { factorKey: "S5.E1.F3", elementKey: "S5.E1", standardKey: "S5", score: 0 },
        { factorKey: "S5.E1.F4", elementKey: "S5.E1", standardKey: "S5", score: 0 },
        { factorKey: "S5.E2.F1", elementKey: "S5.E2", standardKey: "S5", score: 80 },
        { factorKey: "S5.E2.F2", elementKey: "S5.E2", standardKey: "S5", score: 80 },
        { factorKey: "S5.E2.F3", elementKey: "S5.E2", standardKey: "S5", score: 100 },
        { factorKey: "S5.E3.F1", elementKey: "S5.E3", standardKey: "S5", score: 80 },
        { factorKey: "S5.E3.F2", elementKey: "S5.E3", standardKey: "S5", score: 50 },
        { factorKey: "S5.E3.F3", elementKey: "S5.E3", standardKey: "S5", score: 50 },
        { factorKey: "S5.E4.F1", elementKey: "S5.E4", standardKey: "S5", score: 20 },
        { factorKey: "S5.E4.F2", elementKey: "S5.E4", standardKey: "S5", score: 50 },
        { factorKey: "S5.E4.F3", elementKey: "S5.E4", standardKey: "S5", score: 20 },
        { factorKey: "S5.E5.F1", elementKey: "S5.E5", standardKey: "S5", score: 0 },
        { factorKey: "S5.E5.F2", elementKey: "S5.E5", standardKey: "S5", score: 0 },
        { factorKey: "S5.E5.F3", elementKey: "S5.E5", standardKey: "S5", score: 0 },
        { factorKey: "S5.E6.F1", elementKey: "S5.E6", standardKey: "S5", score: 50 },
        { factorKey: "S5.E6.F2", elementKey: "S5.E6", standardKey: "S5", score: 20 },
      ];

      const michaelScoreData: Array<{ factorKey: string; elementKey: string; standardKey: string; score: number }> = [
        { factorKey: "S8.E1.F1", elementKey: "S8.E1", standardKey: "S8", score: 20 },
        { factorKey: "S8.E1.F2", elementKey: "S8.E1", standardKey: "S8", score: 20 },
        { factorKey: "S8.E1.F3", elementKey: "S8.E1", standardKey: "S8", score: 50 },
        { factorKey: "S8.E1.F4", elementKey: "S8.E1", standardKey: "S8", score: 80 },
        { factorKey: "S8.E1.F5", elementKey: "S8.E1", standardKey: "S8", score: 50 },
        { factorKey: "S8.E2.F1", elementKey: "S8.E2", standardKey: "S8", score: 20 },
        { factorKey: "S8.E2.F2", elementKey: "S8.E2", standardKey: "S8", score: 20 },
        { factorKey: "S8.E2.F3", elementKey: "S8.E2", standardKey: "S8", score: 0 },
        { factorKey: "S8.E3.F1", elementKey: "S8.E3", standardKey: "S8", score: 20 },
        { factorKey: "S8.E3.F2", elementKey: "S8.E3", standardKey: "S8", score: 20 },
        { factorKey: "S8.E3.F3", elementKey: "S8.E3", standardKey: "S8", score: 0 },
        { factorKey: "S8.E3.F4", elementKey: "S8.E3", standardKey: "S8", score: 20 },
        { factorKey: "S8.E4.F1", elementKey: "S8.E4", standardKey: "S8", score: 0 },
        { factorKey: "S8.E4.F2", elementKey: "S8.E4", standardKey: "S8", score: 80 },
        { factorKey: "S8.E4.F3", elementKey: "S8.E4", standardKey: "S8", score: 50 },
        { factorKey: "S8.E4.F4", elementKey: "S8.E4", standardKey: "S8", score: 20 },
      ];

      const sandeepSession = await storage.createEvaluationSession({
        vendorId: aidoc.id,
        evaluatorId: "sandeep-patel-s5",
        evaluatorName: "Sandeep Kashyap",
        standardId: null,
        status: "in_progress",
        overallScore: null,
        badgeLevel: null,
        mustPassFailed: false,
      });

      await storage.upsertScores(
        sandeepScoreData.map((s) => ({ ...s, sessionId: sandeepSession.id, notes: null }))
      );

      const sandeepResult = computeWeightedScore(
        sandeepScoreData.map((s) => ({ ...s, notApplicable: false })),
        standards
      );
      await storage.updateEvaluationSession(sandeepSession.id, {
        status: "completed",
        overallScore: sandeepResult.overallScore,
        badgeLevel: sandeepResult.badgeLevel,
        mustPassFailed: sandeepResult.mustPassFailed,
        completedAt: new Date(),
      });

      const michaelSession = await storage.createEvaluationSession({
        vendorId: aidoc.id,
        evaluatorId: "michael-chen-s8",
        evaluatorName: "Michael Sheedy",
        standardId: null,
        status: "in_progress",
        overallScore: null,
        badgeLevel: null,
        mustPassFailed: false,
      });

      await storage.upsertScores(
        michaelScoreData.map((s) => ({ ...s, sessionId: michaelSession.id, notes: null }))
      );

      const michaelResult = computeWeightedScore(
        michaelScoreData.map((s) => ({ ...s, notApplicable: false })),
        standards
      );
      await storage.updateEvaluationSession(michaelSession.id, {
        status: "completed",
        overallScore: michaelResult.overallScore,
        badgeLevel: michaelResult.badgeLevel,
        mustPassFailed: michaelResult.mustPassFailed,
        completedAt: new Date(),
      });

      res.json({
        message: "Seeded completed evaluations for Sandeep Kashyap (S5) and Michael Sheedy (S8)",
        added: 2,
        sessions: [
          { evaluator: "Sandeep Kashyap", standard: "S5", scores: sandeepScoreData.length, overallScore: sandeepResult.overallScore },
          { evaluator: "Michael Sheedy", standard: "S8", scores: michaelScoreData.length, overallScore: michaelResult.overallScore },
        ],
      });
    } catch (error) {
      console.error("Error seeding evaluators:", error);
      res.status(500).json({ message: "Failed to seed evaluators" });
    }
  });

  app.post("/api/admin/reset", async (_req, res) => {
    try {
      await storage.deleteAllCalibrationScores();
      await storage.deleteAllCalibrations();
      await storage.deleteAllScores();
      await storage.deleteAllEvaluations();
      res.json({ message: "Data reset (vendors preserved)" });
    } catch (error) {
      res.status(500).json({ message: "Failed to reset" });
    }
  });

  app.get("/api/admin/export", async (_req, res) => {
    try {
      const vendors = await storage.getVendors();
      const sessions = await storage.getEvaluationSessions();
      const calibrations = await storage.getCalibrationExercises();
      const standards = await getStandards();

      const allScores: any[] = [];
      for (const s of sessions) {
        const scores = await storage.getScoresBySession(s.id);
        allScores.push({ sessionId: s.id, scores });
      }

      const exportData = {
        exportDate: new Date().toISOString(),
        vendors,
        evaluationSessions: sessions,
        evaluationScores: allScores,
        calibrationExercises: calibrations,
        standardCount: standards.length,
      };

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", "attachment; filename=triah-export.json");
      res.json(exportData);
    } catch (error) {
      res.status(500).json({ message: "Failed to export" });
    }
  });

  app.get("/api/admin/download-source", async (_req, res) => {
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      const ROOT = path.resolve(".");
      const EXCLUDE_DIRS = new Set(["node_modules", "dist", ".git", ".local", "attached_assets", ".cache", ".upm"]);
      const EXCLUDE_FILES = new Set(["TRIAH_app.tar.gz"]);

      function addDir(dirPath: string) {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const entry of entries) {
          if (EXCLUDE_DIRS.has(entry.name) || EXCLUDE_FILES.has(entry.name)) continue;
          const fullPath = path.join(dirPath, entry.name);
          const relativePath = path.relative(ROOT, fullPath);
          if (entry.isDirectory()) {
            addDir(fullPath);
          } else {
            try {
              const content = fs.readFileSync(fullPath);
              zip.file(relativePath, content);
            } catch {
            }
          }
        }
      }

      addDir(ROOT);

      const buffer = await zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=TRIAH_app.zip");
      res.setHeader("Content-Length", buffer.length);
      res.send(buffer);
    } catch (error) {
      console.error("Download source error:", error);
      res.status(500).json({ message: "Failed to create zip" });
    }
  });

  return httpServer;
}
