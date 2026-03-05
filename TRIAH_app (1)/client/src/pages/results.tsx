import { useQuery } from "@tanstack/react-query";
import {
  BarChart3, Award, Shield, Building2, Users,
  TrendingUp, AlertTriangle, CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BADGE_COLORS: Record<string, string> = {
  Platinum: "bg-gradient-to-r from-slate-400 to-slate-300 text-white",
  Gold: "bg-gradient-to-r from-amber-400 to-yellow-300 text-white",
  Silver: "bg-gradient-to-r from-gray-300 to-gray-200 text-gray-700",
  Bronze: "bg-gradient-to-r from-orange-500 to-amber-400 text-white",
  "Not Certified": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export default function Results() {
  const { data: vendorResults, isLoading } = useQuery<any[]>({
    queryKey: ["/api/results"],
  });

  const { data: irrOverview } = useQuery<any>({
    queryKey: ["/api/results/irr"],
  });

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-results-title">
          Results & IRR Analysis
        </h1>
        <p className="text-muted-foreground">
          Aggregated scores, badge awards, and inter-rater reliability metrics.
        </p>
      </div>

      <Tabs defaultValue="results">
        <TabsList>
          <TabsTrigger value="results" data-testid="tab-results">Vendor Results</TabsTrigger>
          <TabsTrigger value="irr" data-testid="tab-irr">IRR Analysis</TabsTrigger>
          <TabsTrigger value="comparison" data-testid="tab-comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="mt-4 space-y-4">
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : !vendorResults || vendorResults.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Results Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Complete evaluations to see aggregated results and badge awards.
                </p>
              </CardContent>
            </Card>
          ) : (
            vendorResults.map((vr: any) => (
              <Card key={vr.vendorId} data-testid={`card-result-${vr.vendorId}`}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{vr.vendorName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {vr.evaluationCount} evaluations, {vr.evaluatorCount} evaluators
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {vr.mustPassFailed && (
                        <Badge variant="destructive" className="no-default-active-elevate">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Must-Pass Failed
                        </Badge>
                      )}
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${BADGE_COLORS[vr.badge] || BADGE_COLORS["Not Certified"]}`}>
                        <Award className="h-3.5 w-3.5 inline mr-1" />
                        {vr.badge}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">Overall Score</span>
                      <span className="text-lg font-bold" data-testid={`text-overall-score-${vr.vendorId}`}>
                        {vr.overallScore?.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={vr.overallScore || 0} className="h-3" />
                  </div>

                  {vr.standardScores && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {Object.entries(vr.standardScores as Record<string, number>).map(
                        ([stdId, score]) => (
                          <div
                            key={stdId}
                            className="bg-muted/50 rounded-md p-3"
                            data-testid={`score-standard-${vr.vendorId}-${stdId}`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-xs font-medium">{stdId}</span>
                              <span className="text-xs font-bold">{(score as number).toFixed(1)}%</span>
                            </div>
                            <Progress value={score as number} className="h-1.5" />
                          </div>
                        )
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="irr" className="mt-4 space-y-4">
          {!irrOverview ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">IRR Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Multiple evaluator scores needed for inter-rater reliability analysis.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid sm:grid-cols-4 gap-4">
                <Card data-testid="irr-agreement">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Agreement Rate</p>
                    <p className="text-2xl font-bold">{irrOverview.agreementRate?.toFixed(1) || 0}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Target: ≥85%</p>
                    {(irrOverview.agreementRate || 0) >= 85 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-1" />
                    )}
                  </CardContent>
                </Card>
                <Card data-testid="irr-kappa">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Cohen's Kappa</p>
                    <p className="text-2xl font-bold">{irrOverview.cohensKappa?.toFixed(3) || "N/A"}</p>
                    <p className="text-xs text-muted-foreground mt-1">Pairwise agreement</p>
                  </CardContent>
                </Card>
                <Card data-testid="irr-icc">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">ICC</p>
                    <p className="text-2xl font-bold">{irrOverview.icc?.toFixed(3) || "N/A"}</p>
                    <p className="text-xs text-muted-foreground mt-1">Target: ≥0.75</p>
                    {(irrOverview.icc || 0) >= 0.75 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-1" />
                    )}
                  </CardContent>
                </Card>
                <Card data-testid="irr-alpha">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Cronbach's Alpha</p>
                    <p className="text-2xl font-bold">{irrOverview.cronbachsAlpha?.toFixed(3) || "N/A"}</p>
                    <p className="text-xs text-muted-foreground mt-1">Internal consistency</p>
                  </CardContent>
                </Card>
              </div>

              {irrOverview.byStandard && Object.keys(irrOverview.byStandard).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Per-Standard IRR</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(irrOverview.byStandard as Record<string, any>).map(
                      ([stdId, metrics]) => (
                        <div key={stdId} className="flex items-center gap-4" data-testid={`irr-standard-${stdId}`}>
                          <span className="text-sm font-medium w-8">{stdId}</span>
                          <div className="flex-1">
                            <Progress value={((metrics as any).icc || 0) * 100} className="h-2" />
                          </div>
                          <span className="text-sm text-muted-foreground w-16 text-right">
                            ICC: {((metrics as any).icc || 0).toFixed(3)}
                          </span>
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="mt-4 space-y-4">
          {!vendorResults || vendorResults.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Vendor Comparison</h3>
                <p className="text-sm text-muted-foreground">
                  Complete evaluations to compare vendors side by side.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-5">
                <div className="space-y-4">
                  {vendorResults
                    .sort((a: any, b: any) => (b.overallScore || 0) - (a.overallScore || 0))
                    .map((vr: any, rank: number) => (
                      <div
                        key={vr.vendorId}
                        className="flex items-center gap-4"
                        data-testid={`comparison-${vr.vendorId}`}
                      >
                        <span className="text-lg font-bold text-muted-foreground w-8">
                          #{rank + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-medium truncate">{vr.vendorName}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-bold">{vr.overallScore?.toFixed(1)}%</span>
                              <div className={`px-2 py-0.5 rounded text-xs font-medium ${BADGE_COLORS[vr.badge] || BADGE_COLORS["Not Certified"]}`}>
                                {vr.badge}
                              </div>
                            </div>
                          </div>
                          <Progress value={vr.overallScore || 0} className="h-2" />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
