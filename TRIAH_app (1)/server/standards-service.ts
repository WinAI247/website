import type { RefinedStandard, RefinedElement, RefinedFactor } from "../shared/refined-standards-data";

let standardsCache: RefinedStandard[] | null = null;

export async function getStandards(): Promise<RefinedStandard[]> {
  if (standardsCache) return standardsCache;
  const { REFINED_STANDARDS } = await import("../shared/refined-standards-data");
  standardsCache = REFINED_STANDARDS;
  return standardsCache!;
}

export function getStandardsSummary(standards: RefinedStandard[]) {
  return standards.map((s) => {
    const factorCount = s.elements.reduce((sum, e) => sum + e.factors.length, 0);
    const mustPassElements = s.elements.filter((e) => e.mustPass).length;
    return {
      id: s.id,
      number: s.number,
      name: s.name,
      shortName: s.name.split(":")[0] || s.name,
      domain: s.domain,
      weight: s.weight,
      elementCount: s.elements.length,
      factorCount,
      mustPassElements,
    };
  });
}

export const STANDARD_WEIGHTS: Record<string, number> = {
  S1: 0.20, S2: 0.10, S3: 0.10, S4: 0.15,
  S5: 0.10, S6: 0.10, S7: 0.15, S8: 0.10,
};

export function computeWeightedScore(
  scores: Array<{ factorKey: string; elementKey: string; standardKey: string; score: number; notApplicable?: boolean }>,
  standards: RefinedStandard[]
): {
  overallScore: number;
  standardScores: Record<string, number>;
  mustPassFailed: boolean;
  badgeLevel: string;
} {
  const standardScores: Record<string, number> = {};
  let mustPassFailed = false;

  for (const std of standards) {
    let elementWeightedSum = 0;
    let elementWeightTotal = 0;

    for (const element of std.elements) {
      let factorWeightedSum = 0;
      let factorWeightTotal = 0;

      for (const factor of element.factors) {
        const scoreEntry = scores.find((s) => s.factorKey === factor.id);
        if (scoreEntry && !scoreEntry.notApplicable) {
          factorWeightedSum += scoreEntry.score * factor.weight;
          factorWeightTotal += factor.weight;

          if (factor.mustPass && scoreEntry.score < 50) {
            mustPassFailed = true;
          }
        }
      }

      const elementScore = factorWeightTotal > 0 ? factorWeightedSum / factorWeightTotal : 0;

      if (element.mustPass && elementScore < 50) {
        mustPassFailed = true;
      }

      elementWeightedSum += elementScore * element.weight;
      elementWeightTotal += element.weight;
    }

    standardScores[std.id] = elementWeightTotal > 0 ? elementWeightedSum / elementWeightTotal : 0;
  }

  let overallScore = 0;
  let totalWeight = 0;
  for (const [stdId, score] of Object.entries(standardScores)) {
    const weight = STANDARD_WEIGHTS[stdId] || 0.10;
    overallScore += score * weight;
    totalWeight += weight;
  }
  if (totalWeight > 0) overallScore /= totalWeight;

  let badgeLevel = "Not Certified";
  if (!mustPassFailed) {
    if (overallScore >= 90) badgeLevel = "Platinum";
    else if (overallScore >= 80) badgeLevel = "Gold";
    else if (overallScore >= 70) badgeLevel = "Silver";
    else if (overallScore >= 60) badgeLevel = "Bronze";
  }

  return { overallScore, standardScores, mustPassFailed, badgeLevel };
}

export function computeIRR(
  allScores: Array<{ reviewerId: string; factorKey: string; score: number; notApplicable?: boolean }>
): {
  agreementRate: number;
  cohensKappa: number | null;
  icc: number | null;
  cronbachsAlpha: number | null;
} {
  const eligibleScores = allScores.filter((s) => !s.notApplicable);
  const factorKeys = Array.from(new Set(eligibleScores.map((s) => s.factorKey)));
  const reviewerIds = Array.from(new Set(eligibleScores.map((s) => s.reviewerId)));

  if (reviewerIds.length < 2 || factorKeys.length === 0) {
    return { agreementRate: 0, cohensKappa: null, icc: null, cronbachsAlpha: null };
  }

  let agreements = 0;
  let totalPairs = 0;
  const scoreMap = new Map<string, number>();
  eligibleScores.forEach((s) => scoreMap.set(`${s.reviewerId}:${s.factorKey}`, s.score));

  for (const fk of factorKeys) {
    const factorScores: number[] = [];
    for (const rid of reviewerIds) {
      const s = scoreMap.get(`${rid}:${fk}`);
      if (s !== undefined) factorScores.push(s);
    }

    for (let i = 0; i < factorScores.length; i++) {
      for (let j = i + 1; j < factorScores.length; j++) {
        totalPairs++;
        if (Math.abs(factorScores[i] - factorScores[j]) <= 20) {
          agreements++;
        }
      }
    }
  }

  const agreementRate = totalPairs > 0 ? (agreements / totalPairs) * 100 : 0;

  const levels = [0, 20, 50, 80, 100];
  const toLevelIndex = (v: number) => levels.indexOf(v) >= 0 ? levels.indexOf(v) : Math.round(v / 25);

  let cohensKappa: number | null = null;
  if (reviewerIds.length === 2) {
    const r1 = reviewerIds[0], r2 = reviewerIds[1];
    let agree = 0, total = 0;
    const r1Counts = new Array(5).fill(0);
    const r2Counts = new Array(5).fill(0);

    for (const fk of factorKeys) {
      const s1 = scoreMap.get(`${r1}:${fk}`);
      const s2 = scoreMap.get(`${r2}:${fk}`);
      if (s1 !== undefined && s2 !== undefined) {
        const l1 = toLevelIndex(s1), l2 = toLevelIndex(s2);
        total++;
        if (l1 === l2) agree++;
        r1Counts[l1]++;
        r2Counts[l2]++;
      }
    }

    if (total > 0) {
      const po = agree / total;
      let pe = 0;
      for (let i = 0; i < 5; i++) {
        pe += (r1Counts[i] / total) * (r2Counts[i] / total);
      }
      cohensKappa = pe < 1 ? (po - pe) / (1 - pe) : 1;
    }
  }

  let icc: number | null = null;
  let cronbachsAlpha: number | null = null;

  const matrix: number[][] = [];
  for (const fk of factorKeys) {
    const row: number[] = [];
    let complete = true;
    for (const rid of reviewerIds) {
      const s = scoreMap.get(`${rid}:${fk}`);
      if (s === undefined) { complete = false; break; }
      row.push(s);
    }
    if (complete) matrix.push(row);
  }

  if (matrix.length >= 2) {
    const n = matrix.length;
    const k = reviewerIds.length;
    const grandMean = matrix.flat().reduce((a, b) => a + b, 0) / (n * k);

    let msR = 0, msC = 0, msE = 0;
    const rowMeans = matrix.map((r) => r.reduce((a, b) => a + b, 0) / k);
    const colMeans: number[] = [];
    for (let j = 0; j < k; j++) {
      colMeans.push(matrix.reduce((a, r) => a + r[j], 0) / n);
    }

    for (let i = 0; i < n; i++) msR += k * (rowMeans[i] - grandMean) ** 2;
    for (let j = 0; j < k; j++) msC += n * (colMeans[j] - grandMean) ** 2;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < k; j++) {
        msE += (matrix[i][j] - rowMeans[i] - colMeans[j] + grandMean) ** 2;
      }
    }

    const dfR = n - 1;
    const dfE = (n - 1) * (k - 1);
    msR = dfR > 0 ? msR / dfR : 0;
    msE = dfE > 0 ? msE / dfE : 0;

    icc = msR > 0 ? (msR - msE) / (msR + (k - 1) * msE) : 0;
    icc = Math.max(0, Math.min(1, icc));

    const itemVariances: number[] = [];
    for (let j = 0; j < k; j++) {
      const col = matrix.map((r) => r[j]);
      const mean = col.reduce((a, b) => a + b, 0) / n;
      const variance = col.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
      itemVariances.push(variance);
    }

    const totalScores = matrix.map((r) => r.reduce((a, b) => a + b, 0));
    const totalMean = totalScores.reduce((a, b) => a + b, 0) / n;
    const totalVariance = totalScores.reduce((a, b) => a + (b - totalMean) ** 2, 0) / (n - 1);
    const sumItemVariances = itemVariances.reduce((a, b) => a + b, 0);

    cronbachsAlpha = totalVariance > 0
      ? (k / (k - 1)) * (1 - sumItemVariances / totalVariance)
      : 0;
  }

  return { agreementRate, cohensKappa, icc, cronbachsAlpha };
}
