import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Shield, Building2, ClipboardCheck, Target, BarChart3,
  Award, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight,
  Activity, Brain, Scale, Cpu, Users, Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

const STANDARD_ICONS: Record<string, any> = {
  S1: Shield, S2: Settings, S3: Brain, S4: Activity,
  S5: Scale, S6: Cpu, S7: Users, S8: Target,
};

const STANDARD_COLORS: Record<string, string> = {
  S1: "bg-red-500/10 text-red-600 dark:text-red-400",
  S2: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  S3: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  S4: "bg-green-500/10 text-green-600 dark:text-green-400",
  S5: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  S6: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  S7: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  S8: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<any>({
    queryKey: ["/api/stats"],
  });

  const { data: standardsSummary } = useQuery<any>({
    queryKey: ["/api/standards/summary"],
  });

  const { data: recentEvals } = useQuery<any[]>({
    queryKey: ["/api/evaluations/recent"],
  });

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-dashboard-title">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="text-muted-foreground">
          TRIAH Validation Framework overview and recent activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card data-testid="stat-vendors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-1 mb-2">
                  <p className="text-sm text-muted-foreground">Vendors</p>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{stats?.vendorCount || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Under evaluation</p>
              </CardContent>
            </Card>
            <Card data-testid="stat-evaluations">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-1 mb-2">
                  <p className="text-sm text-muted-foreground">Evaluations</p>
                  <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{stats?.evaluationCount || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.completedCount || 0} completed
                </p>
              </CardContent>
            </Card>
            <Card data-testid="stat-calibrations">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-1 mb-2">
                  <p className="text-sm text-muted-foreground">Calibration</p>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{stats?.calibrationCount || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Exercises</p>
              </CardContent>
            </Card>
            <Card data-testid="stat-standards">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-1 mb-2">
                  <p className="text-sm text-muted-foreground">Standards</p>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.totalFactors || 235} factors
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-1">
            <h2 className="text-lg font-semibold">Standards Overview</h2>
            <Link href="/standards">
              <Button variant="ghost" size="sm" data-testid="button-view-standards">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {standardsSummary?.map((std: any) => {
              const Icon = STANDARD_ICONS[std.id] || Shield;
              const colorClass = STANDARD_COLORS[std.id] || STANDARD_COLORS.S1;
              return (
                <Link key={std.id} href={`/standards/${std.id}`}>
                  <Card className="cursor-pointer hover-elevate" data-testid={`card-standard-${std.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`h-9 w-9 rounded-md ${colorClass} flex items-center justify-center shrink-0`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            S{std.number}: {std.shortName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {std.elementCount} elements, {std.factorCount} factors
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {(std.weight * 100).toFixed(0)}% weight
                            </Badge>
                            {std.mustPassElements > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {std.mustPassElements} must-pass
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-1">
            <h2 className="text-lg font-semibold">Recent Evaluations</h2>
            <Link href="/evaluations">
              <Button variant="ghost" size="sm" data-testid="button-view-evaluations">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          {!recentEvals || recentEvals.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <ClipboardCheck className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No evaluations yet</p>
                <Link href="/evaluations">
                  <Button size="sm" className="mt-3" data-testid="button-start-evaluation">
                    Start Evaluation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentEvals.map((ev: any) => (
                <Card key={ev.id} data-testid={`card-eval-${ev.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <p className="text-sm font-medium truncate">{ev.vendorName}</p>
                      {ev.badgeLevel && (
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {ev.badgeLevel}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      By {ev.evaluatorName} {ev.standardId ? `- ${ev.standardId}` : ""}
                    </p>
                    {ev.overallScore !== null && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs text-muted-foreground">Score</span>
                          <span className="text-xs font-medium">{ev.overallScore?.toFixed(1)}%</span>
                        </div>
                        <Progress value={ev.overallScore || 0} className="h-1.5" />
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${ev.status === "completed" ? "bg-green-500" : "bg-amber-500"}`} />
                      <span className="text-xs text-muted-foreground capitalize">{ev.status?.replace("_", " ")}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-1 mt-6">
            <h2 className="text-lg font-semibold">Badge Thresholds</h2>
          </div>
          <Card>
            <CardContent className="p-4 space-y-3">
              {[
                { name: "Platinum", min: 90, color: "bg-slate-400" },
                { name: "Gold", min: 80, color: "bg-amber-400" },
                { name: "Silver", min: 70, color: "bg-gray-300 dark:bg-gray-500" },
                { name: "Bronze", min: 60, color: "bg-orange-500" },
              ].map((b) => (
                <div key={b.name} className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${b.color}`} />
                  <span className="text-sm flex-1">{b.name}</span>
                  <span className="text-xs text-muted-foreground">{b.min}%+</span>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-1 border-t">
                <AlertTriangle className="h-3 w-3 text-destructive" />
                <span className="text-sm flex-1 text-muted-foreground">Not Certified</span>
                <span className="text-xs text-muted-foreground">&lt;60% or must-pass fail</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
