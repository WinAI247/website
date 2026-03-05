import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import {
  Shield, Settings, Brain, Activity, Scale, Cpu, Users, Target,
  ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, Info, ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { RefinedStandard, RefinedElement, RefinedFactor } from "../../../shared/refined-standards-data";

const STANDARD_ICONS: Record<string, any> = {
  S1: Shield, S2: Settings, S3: Brain, S4: Activity,
  S5: Scale, S6: Cpu, S7: Users, S8: Target,
};

const STANDARD_BG: Record<string, string> = {
  S1: "from-red-500 to-rose-600",
  S2: "from-blue-500 to-indigo-600",
  S3: "from-purple-500 to-violet-600",
  S4: "from-green-500 to-emerald-600",
  S5: "from-amber-500 to-orange-600",
  S6: "from-cyan-500 to-teal-600",
  S7: "from-pink-500 to-fuchsia-600",
  S8: "from-slate-500 to-gray-600",
};

const SCORE_LEVELS = [
  { label: "Exceptional", value: 100, desc: "Comprehensive, externally validated evidence" },
  { label: "Strong", value: 80, desc: "Substantial vendor-specific evidence" },
  { label: "Adequate", value: 50, desc: "Sufficient evidence with possible gaps" },
  { label: "Minimal", value: 20, desc: "Indirect or partial evidence" },
  { label: "Not Met", value: 0, desc: "No relevant evidence" },
];

function StandardDetail({ standardId }: { standardId: string }) {
  const [expandedElements, setExpandedElements] = useState<Set<string>>(new Set());
  const [expandedFactors, setExpandedFactors] = useState<Set<string>>(new Set());

  const { data } = useQuery<{ standards: RefinedStandard[] }>({
    queryKey: ["/api/standards"],
  });

  const standard = data?.standards?.find((s) => s.id === standardId);
  if (!standard) return null;

  const Icon = STANDARD_ICONS[standard.id] || Shield;
  const factorCount = standard.elements.reduce((s, e) => s + e.factors.length, 0);
  const mustPassElements = standard.elements.filter((e) => e.mustPass).length;

  const toggleElement = (id: string) => {
    setExpandedElements((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFactor = (id: string) => {
    setExpandedFactors((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/standards">
          <Button variant="ghost" size="sm" data-testid="button-back-standards">
            <ArrowLeft className="h-4 w-4 mr-1" /> Standards
          </Button>
        </Link>
      </div>

      <div className="flex items-start gap-4">
        <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${STANDARD_BG[standard.id]} flex items-center justify-center shrink-0`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid={`text-standard-title-${standard.id}`}>
            S{standard.number}: {standard.name}
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">{standard.description}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="secondary">{standard.domain}</Badge>
            <Badge variant="outline">{(standard.weight * 100).toFixed(0)}% weight</Badge>
            <Badge variant="outline">{standard.elements.length} elements</Badge>
            <Badge variant="outline">{factorCount} factors</Badge>
            {mustPassElements > 0 && (
              <Badge variant="destructive" className="no-default-active-elevate">
                {mustPassElements} must-pass elements
              </Badge>
            )}
          </div>
        </div>
      </div>

      {standard.overlapNotes.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Overlap Resolution Notes</p>
            </div>
            <ul className="space-y-1">
              {standard.overlapNotes.map((note, i) => (
                <li key={i} className="text-xs text-muted-foreground pl-6">
                  {note}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {standard.elements.map((element) => {
          const isExpanded = expandedElements.has(element.id);
          return (
            <Card key={element.id} data-testid={`card-element-${element.id}`}>
              <div
                className="cursor-pointer p-4"
                onClick={() => toggleElement(element.id)}
                data-testid={`toggle-element-${element.id}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-muted-foreground shrink-0">
                      {element.id}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">{element.name}</h3>
                        {element.mustPass && (
                          <Badge variant="destructive" className="text-xs no-default-active-elevate">
                            Must Pass
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {element.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground">
                        {(element.weight * 100).toFixed(0)}% weight
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {element.factors.length} factors
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-2 border-t pt-3">
                  {element.factors.map((factor) => {
                    const isFactorExpanded = expandedFactors.has(factor.id);
                    return (
                      <div
                        key={factor.id}
                        className="rounded-md bg-muted/50 p-3"
                        data-testid={`card-factor-${factor.id}`}
                      >
                        <div
                          className="cursor-pointer"
                          onClick={() => toggleFactor(factor.id)}
                          data-testid={`toggle-factor-${factor.id}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-muted-foreground">
                                  {factor.id}
                                </span>
                                {factor.mustPass && (
                                  <Badge variant="destructive" className="text-xs no-default-active-elevate">
                                    Must Pass
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {(factor.weight * 100).toFixed(0)}% weight
                                </Badge>
                              </div>
                              <p className="text-sm">{factor.description}</p>
                              {factor.crossReference && (
                                <p className="text-xs text-muted-foreground mt-1 italic">
                                  {factor.crossReference}
                                </p>
                              )}
                            </div>
                            {isFactorExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                            )}
                          </div>
                        </div>
                        {isFactorExpanded && (
                          <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Scoring Rubric
                            </p>
                            {SCORE_LEVELS.map((level) => {
                              const rubricKey = level.label === "Not Met"
                                ? "notMet"
                                : level.label.toLowerCase();
                              const text = (factor.rubric as any)[rubricKey] || "";
                              const colors: Record<string, string> = {
                                "Exceptional": "border-l-green-500 dark:border-l-green-400",
                                "Strong": "border-l-blue-500 dark:border-l-blue-400",
                                "Adequate": "border-l-amber-500 dark:border-l-amber-400",
                                "Minimal": "border-l-orange-500 dark:border-l-orange-400",
                                "Not Met": "border-l-red-500 dark:border-l-red-400",
                              };
                              return (
                                <div
                                  key={level.label}
                                  className={`pl-3 border-l-2 ${colors[level.label]}`}
                                >
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-xs font-semibold">
                                      {level.value}% - {level.label}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{text}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function Standards() {
  const [, params] = useRoute("/standards/:id");

  if (params?.id) {
    return <StandardDetail standardId={params.id} />;
  }

  return <StandardsList />;
}

function StandardsList() {
  const { data } = useQuery<{ standards: RefinedStandard[]; totalFactors: number }>({
    queryKey: ["/api/standards"],
  });

  const standards = data?.standards || [];
  const totalFactors = data?.totalFactors || 0;

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-standards-title">
          TRIAH Standards
        </h1>
        <p className="text-muted-foreground">
          {totalFactors} factors across 8 standards with 5-level rubric scoring.
        </p>
      </div>

      <div className="grid gap-4">
        {standards.map((std) => {
          const Icon = STANDARD_ICONS[std.id] || Shield;
          const factorCount = std.elements.reduce((s, e) => s + e.factors.length, 0);
          const mustPassCount = std.elements.filter((e) => e.mustPass).length;
          const mustPassFactors = std.elements.reduce(
            (s, e) => s + e.factors.filter((f) => f.mustPass).length, 0
          );

          return (
            <Link key={std.id} href={`/standards/${std.id}`}>
              <Card className="cursor-pointer hover-elevate" data-testid={`card-standard-list-${std.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${STANDARD_BG[std.id]} flex items-center justify-center shrink-0`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">
                            S{std.number}: {std.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                            {std.description}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <Badge variant="secondary" className="text-xs">{std.domain}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {(std.weight * 100).toFixed(0)}% weight
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {std.elements.length} elements
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {factorCount} factors
                        </Badge>
                        {mustPassCount > 0 && (
                          <Badge variant="destructive" className="text-xs no-default-active-elevate">
                            {mustPassCount} must-pass elements
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
  );
}
