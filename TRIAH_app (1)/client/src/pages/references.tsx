import { useState, useMemo } from "react";
import { BookOpen, ExternalLink, Shield, Search, ChevronDown, ChevronRight } from "lucide-react";
import { TRIAH_REFERENCES, getReferencesByTier, isTRIAHIP, type TRIAHReference } from "@shared/reference-library";
import { REFINED_STANDARDS } from "@shared/refined-standards-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const TYPE_LABELS: Record<TRIAHReference["type"], string> = {
  federal: "Federal (US)",
  international: "International",
  state: "State",
  standards_body: "Standards Body",
  consensus: "Consensus & Governance",
  academic: "Academic",
};

const TYPE_COLORS: Record<TRIAHReference["type"], string> = {
  federal: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  international: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  state: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  standards_body: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  consensus: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  academic: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

const TIER_ORDER: TRIAHReference["type"][] = [
  "federal", "international", "state", "standards_body", "consensus", "academic"
];

function ReferenceCard({ reference: r }: { reference: TRIAHReference }) {
  return (
    <Card className="mb-3 border border-border/60 hover:border-border transition-colors" data-testid={`card-ref-${r.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-semibold text-sm text-foreground">{r.title}</span>
              <Badge variant="outline" className="text-xs font-mono shrink-0" data-testid={`badge-ref-short-${r.id}`}>
                {r.shortName}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs text-muted-foreground">{r.issuer}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${TYPE_COLORS[r.type]}`}>
                {TYPE_LABELS[r.type]}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3" data-testid={`text-ref-desc-${r.id}`}>
              {r.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex gap-1 flex-wrap">
                {r.standardIds.map(sid => (
                  <Badge key={sid} variant="secondary" className="text-xs px-1.5 py-0.5" data-testid={`badge-std-${r.id}-${sid}`}>
                    {sid}
                  </Badge>
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-1">
                · Cited by {r.factorIds.length} factor{r.factorIds.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 text-xs gap-1"
            onClick={() => window.open(r.url, "_blank", "noopener,noreferrer")}
            data-testid={`button-ref-url-${r.id}`}
          >
            <ExternalLink className="h-3 w-3" />
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TierSection({ tier, refs }: { tier: "mandatory" | "preferred" | "optional", refs: TRIAHReference[] }) {
  const grouped = useMemo(() => {
    const map: Partial<Record<TRIAHReference["type"], TRIAHReference[]>> = {};
    for (const r of refs) {
      if (!map[r.type]) map[r.type] = [];
      map[r.type]!.push(r);
    }
    return map;
  }, [refs]);

  if (refs.length === 0) {
    return <p className="text-sm text-muted-foreground py-6 text-center">No references match your filters.</p>;
  }

  return (
    <div className="space-y-6">
      {TIER_ORDER.filter(type => grouped[type]?.length).map(type => (
        <div key={type}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 pb-1 border-b border-border/50">
            {TYPE_LABELS[type]}
          </h3>
          <div>
            {grouped[type]!.map(r => <ReferenceCard key={r.id} reference={r} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function TRIAHIPSection({ factorIds }: { factorIds: string[] }) {
  const [expanded, setExpanded] = useState(false);

  const byStandard = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const fid of factorIds) {
      const std = fid.split(".")[0];
      if (!map[std]) map[std] = [];
      map[std].push(fid);
    }
    return map;
  }, [factorIds]);

  return (
    <div className="mt-8 border border-border rounded-lg p-5 bg-muted/20">
      <button
        className="w-full flex items-center justify-between text-left"
        onClick={() => setExpanded(e => !e)}
        data-testid="button-triah-ip-toggle"
      >
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-purple-500" />
          <span className="font-semibold text-sm">TRIAH Intellectual Property</span>
          <Badge variant="secondary" className="text-xs">{factorIds.length} factors</Badge>
        </div>
        {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>
      {!expanded && (
        <p className="text-xs text-muted-foreground mt-2">
          {factorIds.length} evaluation factors have no external citations — these represent the TRIAH framework's original intellectual contribution. Click to expand.
        </p>
      )}
      {expanded && (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-4">
            The following factors are not governed by any specific external regulation or published standard.
            They represent the TRIAH panel's original framework design — expert consensus on what good healthcare AI practice looks like beyond formal regulatory requirements.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" data-testid="section-triah-ip">
            {Object.entries(byStandard).sort().map(([std, fids]) => (
              <div key={std} className="bg-background border border-border/50 rounded p-3">
                <div className="font-semibold text-xs text-purple-600 dark:text-purple-400 mb-2">{std}</div>
                <div className="space-y-1">
                  {fids.map(fid => (
                    <div key={fid} className="text-xs text-muted-foreground font-mono" data-testid={`text-triah-ip-${fid}`}>
                      {fid}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function References() {
  const [search, setSearch] = useState("");
  const [stdFilter, setStdFilter] = useState<string>("all");

  const allFactorIds = useMemo(() => {
    const ids: string[] = [];
    for (const std of REFINED_STANDARDS) {
      for (const el of std.elements) {
        for (const f of el.factors) {
          ids.push(f.id);
        }
      }
    }
    return ids;
  }, []);

  const triahIPFactors = useMemo(() => allFactorIds.filter(id => isTRIAHIP(id)), [allFactorIds]);

  const filteredRefs = useMemo(() => {
    const q = search.toLowerCase().trim();
    return TRIAH_REFERENCES.filter(r => {
      const matchesSearch = !q || [r.title, r.shortName, r.issuer, r.description].some(s => s.toLowerCase().includes(q));
      const matchesStd = stdFilter === "all" || r.standardIds.includes(stdFilter);
      return matchesSearch && matchesStd;
    });
  }, [search, stdFilter]);

  const mandatory = filteredRefs.filter(r => r.tier === "mandatory");
  const preferred = filteredRefs.filter(r => r.tier === "preferred");
  const optional = filteredRefs.filter(r => r.tier === "optional");

  const standardIds = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
  const totalMandatory = getReferencesByTier("mandatory").length;
  const totalPreferred = getReferencesByTier("preferred").length;
  const totalOptional = getReferencesByTier("optional").length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight" data-testid="heading-references">
            TRIAH Reference Library
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          External authorities governing each evaluation factor, organized by requirement level. References are sourced from the original standard documents and mapped to each factor.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-muted/40 border border-border rounded-lg p-3 text-center" data-testid="stat-total-refs">
          <div className="text-2xl font-bold">{TRIAH_REFERENCES.length}</div>
          <div className="text-xs text-muted-foreground">Total References</div>
        </div>
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3 text-center" data-testid="stat-mandatory-refs">
          <div className="text-2xl font-bold text-red-700 dark:text-red-400">{totalMandatory}</div>
          <div className="text-xs text-red-600 dark:text-red-400">Mandatory</div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-center" data-testid="stat-preferred-refs">
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{totalPreferred}</div>
          <div className="text-xs text-amber-600 dark:text-amber-400">Preferred</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 text-center" data-testid="stat-triah-ip">
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{triahIPFactors.length}</div>
          <div className="text-xs text-purple-600 dark:text-purple-400">TRIAH IP Factors</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search references by title, issuer, or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            data-testid="input-search-refs"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            className={`text-xs px-2.5 py-1.5 rounded border font-medium transition-colors ${stdFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50 text-muted-foreground"}`}
            onClick={() => setStdFilter("all")}
            data-testid="chip-filter-all"
          >
            All
          </button>
          {standardIds.map(sid => (
            <button
              key={sid}
              className={`text-xs px-2.5 py-1.5 rounded border font-medium transition-colors ${stdFilter === sid ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50 text-muted-foreground"}`}
              onClick={() => setStdFilter(sid)}
              data-testid={`chip-filter-${sid}`}
            >
              {sid}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="mandatory" data-testid="tabs-refs">
        <TabsList className="mb-4" data-testid="tablist-refs">
          <TabsTrigger value="mandatory" data-testid="tab-mandatory">
            Mandatory <Badge variant="secondary" className="ml-1.5 text-xs">{mandatory.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="preferred" data-testid="tab-preferred">
            Preferred <Badge variant="secondary" className="ml-1.5 text-xs">{preferred.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="optional" data-testid="tab-optional">
            Optional <Badge variant="secondary" className="ml-1.5 text-xs">{optional.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mandatory" data-testid="tabcontent-mandatory">
          <TierSection tier="mandatory" refs={mandatory} />
        </TabsContent>
        <TabsContent value="preferred" data-testid="tabcontent-preferred">
          <TierSection tier="preferred" refs={preferred} />
        </TabsContent>
        <TabsContent value="optional" data-testid="tabcontent-optional">
          <TierSection tier="optional" refs={optional} />
        </TabsContent>
      </Tabs>

      <TRIAHIPSection factorIds={triahIPFactors} />
    </div>
  );
}
