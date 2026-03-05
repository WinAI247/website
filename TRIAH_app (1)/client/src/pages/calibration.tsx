import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useRoute, useLocation } from "wouter";
import {
  Target, ArrowLeft, Plus, ChevronRight, Loader2,
  CheckCircle2, AlertTriangle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CalibrationExercise, CalibrationScore } from "@shared/schema";
import type { RefinedStandard, RefinedFactor } from "../../../shared/refined-standards-data";

const SCORE_OPTIONS = [
  { value: 100, label: "Exceptional", color: "bg-green-500" },
  { value: 80, label: "Strong", color: "bg-blue-500" },
  { value: 50, label: "Adequate", color: "bg-amber-500" },
  { value: 20, label: "Minimal", color: "bg-orange-500" },
  { value: 0, label: "Not Met", color: "bg-red-500" },
];

function NewCalibrationDialog() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("spot_check");
  const [open, setOpen] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/calibrations", data),
    onSuccess: async (res) => {
      const exercise = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/calibrations"] });
      setOpen(false);
      setLocation(`/calibration/${exercise.id}`);
    },
    onError: () => toast({ title: "Error creating exercise", variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-new-calibration">
          <Plus className="h-4 w-4 mr-2" />
          New Exercise
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Calibration Exercise</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pre-IRR Training Round 1"
              data-testid="input-calibration-name"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose..."
              data-testid="input-calibration-desc"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger data-testid="select-calibration-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pre_irr_training">Pre-IRR Training</SelectItem>
                <SelectItem value="full_calibration">Full Calibration</SelectItem>
                <SelectItem value="spot_check">Ongoing Spot-Check</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => createMutation.mutate({ name, description, type, status: "setup" })}
            disabled={!name || createMutation.isPending}
            data-testid="button-create-calibration"
          >
            {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create Exercise
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CalibrationDetail({ exerciseId }: { exerciseId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [scores, setScores] = useState<Map<string, { score: number; notes: string }>>(new Map());

  const { data: exercise, isLoading } = useQuery<CalibrationExercise>({
    queryKey: ["/api/calibrations", parseInt(exerciseId)],
  });

  const { data: existingScores } = useQuery<CalibrationScore[]>({
    queryKey: ["/api/calibrations", parseInt(exerciseId), "scores"],
  });

  const { data: standardsData } = useQuery<{ standards: RefinedStandard[] }>({
    queryKey: ["/api/standards"],
  });

  const { data: irrResults } = useQuery<any>({
    queryKey: ["/api/calibrations", parseInt(exerciseId), "irr"],
  });

  const sampleFactors = standardsData?.standards
    ?.flatMap((s) =>
      s.elements.flatMap((e) =>
        e.factors.slice(0, 2).map((f) => ({ ...f, standardId: s.id, elementId: e.id }))
      )
    )
    ?.slice(0, 10) || [];

  const submitMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", `/api/calibrations/${exerciseId}/scores`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calibrations", parseInt(exerciseId)] });
      toast({ title: "Scores submitted" });
    },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <Skeleton className="h-8 w-64 mb-4" />
      </div>
    );
  }

  if (!exercise) return null;

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/calibration">
          <Button variant="ghost" size="sm" data-testid="button-back-calibration">
            <ArrowLeft className="h-4 w-4 mr-1" /> Calibration
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-calibration-title">
            {exercise.name}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{exercise.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{exercise.type?.replace(/_/g, " ")}</Badge>
            <Badge variant={exercise.status === "completed" ? "default" : "outline"}>
              {exercise.status}
            </Badge>
          </div>
        </div>
        <Button
          onClick={() =>
            submitMutation.mutate({
              reviewerId: user?.id,
              reviewerName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
              scores: Array.from(scores.entries()).map(([factorKey, v]) => ({
                factorKey,
                score: v.score,
                notes: v.notes,
              })),
            })
          }
          disabled={scores.size === 0 || submitMutation.isPending}
          data-testid="button-submit-calibration"
        >
          {submitMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Submit Scores
        </Button>
      </div>

      {irrResults && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">IRR Analysis Results</h3>
            <div className="grid sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Agreement Rate</p>
                <p className="text-xl font-bold" data-testid="text-agreement-rate">
                  {irrResults.agreementRate?.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Target: ≥85% within ±1 level
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cohen's Kappa</p>
                <p className="text-xl font-bold" data-testid="text-cohens-kappa">
                  {irrResults.cohensKappa?.toFixed(3) || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ICC</p>
                <p className="text-xl font-bold" data-testid="text-icc">
                  {irrResults.icc?.toFixed(3) || "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">Target: ≥0.75</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cronbach's Alpha</p>
                <p className="text-xl font-bold" data-testid="text-cronbachs-alpha">
                  {irrResults.cronbachsAlpha?.toFixed(3) || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h3 className="font-semibold">Sample Factors for Scoring</h3>
        {sampleFactors.map((factor) => (
          <Card key={factor.id} data-testid={`cal-factor-${factor.id}`}>
            <CardContent className="p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">{factor.id}</span>
                  <Badge variant="outline" className="text-xs">{factor.standardId}</Badge>
                </div>
                <p className="text-sm">{factor.description}</p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {SCORE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setScores((prev) => {
                        const next = new Map(prev);
                        const existing = next.get(factor.id) || { score: 0, notes: "" };
                        next.set(factor.id, { ...existing, score: opt.value });
                        return next;
                      })
                    }
                    className={`p-2 rounded-md text-center border transition-all ${
                      scores.get(factor.id)?.score === opt.value
                        ? "ring-2 ring-primary bg-primary/10 border-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                    data-testid={`cal-score-${factor.id}-${opt.value}`}
                  >
                    <div className={`h-2 w-2 rounded-full ${opt.color} mx-auto mb-1`} />
                    <span className="text-xs font-medium">{opt.value}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Calibration() {
  const [, params] = useRoute("/calibration/:id");

  if (params?.id) return <CalibrationDetail exerciseId={params.id} />;

  return <CalibrationList />;
}

function CalibrationList() {
  const { data: exercises, isLoading } = useQuery<CalibrationExercise[]>({
    queryKey: ["/api/calibrations"],
  });

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-calibration-list-title">
            Calibration Tracker
          </h1>
          <p className="text-muted-foreground">
            IRR training and calibration exercises for evaluator consistency.
          </p>
        </div>
        <NewCalibrationDialog />
      </div>

      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : !exercises || exercises.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Calibration Exercises</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create calibration exercises to train evaluators and measure inter-rater reliability.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {exercises.map((ex) => (
            <Link key={ex.id} href={`/calibration/${ex.id}`}>
              <Card className="cursor-pointer hover-elevate" data-testid={`card-calibration-${ex.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{ex.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{ex.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{ex.type?.replace(/_/g, " ")}</Badge>
                        <Badge variant={ex.status === "completed" ? "default" : "outline"}>
                          {ex.status}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
