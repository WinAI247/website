import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Settings, Database, Users, BarChart3, Download,
  RefreshCw, Loader2, CheckCircle2, Trash2, Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Admin() {
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery<any>({
    queryKey: ["/api/stats"],
  });

  const { data: allEvals } = useQuery<any[]>({
    queryKey: ["/api/evaluations"],
  });

  const { data: allCalibrations } = useQuery<any[]>({
    queryKey: ["/api/calibrations"],
  });

  const seedMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/seed", {}),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({ title: "Mock data seeded successfully" });
    },
    onError: () => toast({ title: "Error seeding data", variant: "destructive" }),
  });

  const reseedMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/reseed", {}),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({ title: "Vendors re-seeded with updated document content" });
    },
    onError: () => toast({ title: "Error re-seeding data", variant: "destructive" }),
  });

  const seedMissingMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/seed-missing", {}),
    onSuccess: async (res) => {
      const data = await res.json();
      queryClient.invalidateQueries();
      toast({ title: data.message });
    },
    onError: () => toast({ title: "Error adding new vendors", variant: "destructive" }),
  });

  const resetMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/reset", {}),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({ title: "Data reset successfully" });
    },
    onError: () => toast({ title: "Error resetting data", variant: "destructive" }),
  });

  const seedEvaluatorsMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/seed-evaluators", {}),
    onSuccess: async (res) => {
      const data = await res.json();
      queryClient.invalidateQueries();
      toast({ title: data.message });
    },
    onError: () => toast({ title: "Error seeding evaluators", variant: "destructive" }),
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("GET", "/api/admin/export");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `triah-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    onSuccess: () => toast({ title: "Export downloaded" }),
    onError: () => toast({ title: "Export failed", variant: "destructive" }),
  });

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-admin-title">
          Admin Panel
        </h1>
        <p className="text-muted-foreground">
          System management, data operations, and reporting.
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-admin-overview">Overview</TabsTrigger>
          <TabsTrigger value="data" data-testid="tab-admin-data">Data Operations</TabsTrigger>
          <TabsTrigger value="evaluators" data-testid="tab-admin-evaluators">Evaluators</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card data-testid="admin-stat-vendors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Vendors</p>
                    </div>
                    <p className="text-2xl font-bold">{stats?.vendorCount || 0}</p>
                  </CardContent>
                </Card>
                <Card data-testid="admin-stat-evals">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Evaluations</p>
                    </div>
                    <p className="text-2xl font-bold">{stats?.evaluationCount || 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats?.completedCount || 0} completed
                    </p>
                  </CardContent>
                </Card>
                <Card data-testid="admin-stat-scores">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Scores</p>
                    </div>
                    <p className="text-2xl font-bold">{stats?.scoreCount || 0}</p>
                  </CardContent>
                </Card>
                <Card data-testid="admin-stat-calibrations">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Calibrations</p>
                    </div>
                    <p className="text-2xl font-bold">{stats?.calibrationCount || 0}</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {allEvals && allEvals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">All Evaluations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4">Vendor</th>
                        <th className="text-left py-2 pr-4">Evaluator</th>
                        <th className="text-left py-2 pr-4">Scope</th>
                        <th className="text-left py-2 pr-4">Status</th>
                        <th className="text-right py-2">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allEvals.map((ev: any) => (
                        <tr key={ev.id} className="border-b last:border-0" data-testid={`admin-eval-row-${ev.id}`}>
                          <td className="py-2 pr-4 font-medium">{ev.vendorName || `#${ev.vendorId}`}</td>
                          <td className="py-2 pr-4 text-muted-foreground">{ev.evaluatorName}</td>
                          <td className="py-2 pr-4 text-muted-foreground">{ev.standardId || "Full"}</td>
                          <td className="py-2 pr-4">
                            <Badge variant={ev.status === "completed" ? "default" : "secondary"} className="text-xs">
                              {ev.status}
                            </Badge>
                          </td>
                          <td className="py-2 text-right font-medium">
                            {ev.overallScore != null ? `${ev.overallScore.toFixed(1)}%` : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="data" className="mt-4 space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card data-testid="card-seed">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Seed Mock Data</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Populate mock vendors with documents and evidence profiles.
                </p>
                <Button
                  onClick={() => seedMutation.mutate()}
                  disabled={seedMutation.isPending}
                  className="w-full"
                  data-testid="button-seed"
                >
                  {seedMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Seed Vendors (first run)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => seedMissingMutation.mutate()}
                  disabled={seedMissingMutation.isPending}
                  className="w-full border-green-500 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950"
                  data-testid="button-seed-missing"
                >
                  {seedMissingMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add New Vendors Only
                </Button>
                <Button
                  variant="outline"
                  onClick={() => reseedMutation.mutate()}
                  disabled={reseedMutation.isPending}
                  className="w-full border-amber-400 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950"
                  data-testid="button-reseed"
                >
                  {reseedMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Re-seed (Refresh Documents)
                </Button>
              </CardContent>
            </Card>

            <Card data-testid="card-seed-evaluators">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Seed Evaluators</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add Sandeep Kashyap (S5) and Michael Sheedy (S8) with completed evaluation data for IRR and calibration.
                </p>
                <Button
                  variant="outline"
                  onClick={() => seedEvaluatorsMutation.mutate()}
                  disabled={seedEvaluatorsMutation.isPending}
                  className="w-full border-blue-400 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
                  data-testid="button-seed-evaluators"
                >
                  {seedEvaluatorsMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Sandeep & Michael
                </Button>
              </CardContent>
            </Card>

            <Card data-testid="card-export">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Export Data</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Download all evaluations, scores, and results as a JSON file.
                </p>
                <Button
                  variant="outline"
                  onClick={() => exportMutation.mutate()}
                  disabled={exportMutation.isPending}
                  className="w-full"
                  data-testid="button-export"
                >
                  {exportMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Export JSON
                </Button>
              </CardContent>
            </Card>

            <Card data-testid="card-download-source">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Download Source Code</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Download the full app source code as a ZIP file. Use this to transfer the app to another workspace.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = "/api/admin/download-source";
                    a.download = "TRIAH_app.zip";
                    a.click();
                  }}
                  className="w-full"
                  data-testid="button-download-source"
                >
                  Download ZIP
                </Button>
              </CardContent>
            </Card>

            <Card data-testid="card-reset">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  <h3 className="font-semibold">Reset Data</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Clear all evaluations, scores, and calibration data. Vendors are preserved.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Are you sure? This will delete all evaluation and calibration data.")) {
                      resetMutation.mutate();
                    }
                  }}
                  disabled={resetMutation.isPending}
                  className="w-full"
                  data-testid="button-reset"
                >
                  {resetMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Reset Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evaluators" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3">Evaluator Activity</h3>
              {!allEvals || allEvals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No evaluator activity yet.</p>
              ) : (
                <div className="space-y-3">
                  {Array.from(
                    new Map(
                      allEvals.map((ev: any) => [
                        ev.evaluatorId,
                        {
                          id: ev.evaluatorId,
                          name: ev.evaluatorName,
                          count: allEvals.filter((e: any) => e.evaluatorId === ev.evaluatorId).length,
                          completed: allEvals.filter(
                            (e: any) => e.evaluatorId === ev.evaluatorId && e.status === "completed"
                          ).length,
                        },
                      ])
                    ).values()
                  ).map((evaluator: any) => (
                    <div
                      key={evaluator.id}
                      className="flex items-center justify-between gap-3 p-3 bg-muted/50 rounded-md"
                      data-testid={`evaluator-${evaluator.id}`}
                    >
                      <div>
                        <p className="text-sm font-medium">{evaluator.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {evaluator.count} evaluations, {evaluator.completed} completed
                        </p>
                      </div>
                      <Badge variant="outline">{evaluator.completed}/{evaluator.count}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
