import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import {
  Building2, FileText, Award, ChevronRight, ArrowLeft,
  Package, Shield, TrendingUp, AlertTriangle, CheckCircle2, Mail, Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Vendor } from "@shared/schema";

const BADGE_COLORS: Record<string, string> = {
  platinum: "bg-gradient-to-r from-slate-400 to-slate-300 text-white",
  gold: "bg-gradient-to-r from-amber-400 to-yellow-300 text-white",
  silver: "bg-gradient-to-r from-gray-300 to-gray-200 text-gray-700",
  bronze: "bg-gradient-to-r from-orange-500 to-amber-400 text-white",
};

const EVIDENCE_COLORS: Record<string, string> = {
  rich: "text-green-600 dark:text-green-400",
  moderate: "text-amber-600 dark:text-amber-400",
  minimal: "text-red-600 dark:text-red-400",
};

function VendorDetail({ vendorId }: { vendorId: string }) {
  const { toast } = useToast();
  const { data: vendor, isLoading } = useQuery<Vendor>({
    queryKey: ["/api/vendors", parseInt(vendorId)],
  });

  const { data: vendorEvals } = useQuery<any[]>({
    queryKey: ["/api/vendors", parseInt(vendorId), "evaluations"],
  });

  const [intakeEmail, setIntakeEmail] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [contactsEditing, setContactsEditing] = useState(false);

  const contactMutation = useMutation({
    mutationFn: (data: { intakeContactEmail: string; vendorContactEmail: string }) =>
      apiRequest("PATCH", `/api/vendors/${vendorId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors", parseInt(vendorId)] });
      toast({ title: "Contact details saved" });
      setContactsEditing(false);
    },
    onError: () => toast({ title: "Failed to save contacts", variant: "destructive" }),
  });

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!vendor) return null;

  const docs = (vendor.documents as any[]) || [];
  const evidenceByStd = (vendor.evidenceByStandard as Record<string, string>) || {};

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/vendors">
          <Button variant="ghost" size="sm" data-testid="button-back-vendors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Vendors
          </Button>
        </Link>
      </div>

      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Building2 className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid={`text-vendor-name-${vendor.id}`}>
            {vendor.name}
          </h1>
          <p className="text-muted-foreground">{vendor.company} — {vendor.product}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge className={EVIDENCE_COLORS[vendor.evidenceLevel] || ""} variant="outline">
              {vendor.evidenceLevel} evidence
            </Badge>
            {vendor.expectedBadge && (
              <Badge variant="secondary">{vendor.expectedBadge} expected</Badge>
            )}
            {vendor.expectedScoreRange && (
              <Badge variant="outline">{vendor.expectedScoreRange}</Badge>
            )}
          </div>
        </div>
      </div>

      {vendor.description && (
        <p className="text-sm text-muted-foreground max-w-2xl">{vendor.description}</p>
      )}

      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents" data-testid="tab-documents">
            Documents ({docs.length})
          </TabsTrigger>
          <TabsTrigger value="evidence" data-testid="tab-evidence">
            Evidence by Standard
          </TabsTrigger>
          <TabsTrigger value="evaluations" data-testid="tab-evaluations">
            Evaluations
          </TabsTrigger>
          <TabsTrigger value="contacts" data-testid="tab-contacts">
            Contacts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-4">
          {docs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents submitted.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {docs.map((doc, i) => (
                <Card key={i} data-testid={`card-doc-${i}`}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.category}</p>
                      <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="evidence" className="mt-4">
          <div className="grid gap-3">
            {Object.entries(evidenceByStd).map(([stdId, desc]) => (
              <Card key={stdId} data-testid={`card-evidence-${stdId}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-semibold">{stdId}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="evaluations" className="mt-4">
          {!vendorEvals || vendorEvals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-3">No evaluations yet.</p>
              <Link href="/evaluations">
                <Button size="sm" data-testid="button-start-eval-vendor">Start Evaluation</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {vendorEvals.map((ev: any) => (
                <Card key={ev.id} data-testid={`card-vendor-eval-${ev.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-sm font-medium">
                        {ev.evaluatorName} {ev.standardId && `- ${ev.standardId}`}
                      </p>
                      <Badge
                        variant={ev.status === "completed" ? "default" : "secondary"}
                      >
                        {ev.status}
                      </Badge>
                    </div>
                    {ev.overallScore !== null && (
                      <div className="flex items-center gap-3">
                        <Progress value={ev.overallScore} className="flex-1 h-2" />
                        <span className="text-sm font-semibold">{ev.overallScore?.toFixed(1)}%</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="contacts" className="mt-4">
          <Card>
            <CardContent className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Contact Emails</span>
                </div>
                {!contactsEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIntakeEmail((vendor as any).intakeContactEmail || "");
                      setVendorEmail((vendor as any).vendorContactEmail || "");
                      setContactsEditing(true);
                    }}
                    data-testid="button-edit-contacts"
                  >
                    Edit
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground -mt-2">
                These emails are used when generating document request drafts from the evaluation workspace.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Intake Contact Email
                  </label>
                  {contactsEditing ? (
                    <Input
                      type="email"
                      placeholder="intake@hospital.org"
                      value={intakeEmail}
                      onChange={(e) => setIntakeEmail(e.target.value)}
                      data-testid="input-intake-email"
                    />
                  ) : (
                    <p className="text-sm" data-testid="text-intake-email">
                      {(vendor as any).intakeContactEmail || <span className="text-muted-foreground italic">Not set</span>}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Vendor Contact Email
                  </label>
                  {contactsEditing ? (
                    <Input
                      type="email"
                      placeholder="contact@vendor.com"
                      value={vendorEmail}
                      onChange={(e) => setVendorEmail(e.target.value)}
                      data-testid="input-vendor-email"
                    />
                  ) : (
                    <p className="text-sm" data-testid="text-vendor-email">
                      {(vendor as any).vendorContactEmail || <span className="text-muted-foreground italic">Not set</span>}
                    </p>
                  )}
                </div>
              </div>
              {contactsEditing && (
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setContactsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => contactMutation.mutate({ intakeContactEmail: intakeEmail, vendorContactEmail: vendorEmail })}
                    disabled={contactMutation.isPending}
                    data-testid="button-save-contacts"
                  >
                    {contactMutation.isPending ? "Saving…" : (
                      <><Save className="h-3.5 w-3.5 mr-1.5" />Save Contacts</>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Vendors() {
  const [, params] = useRoute("/vendors/:id");

  if (params?.id) return <VendorDetail vendorId={params.id} />;

  return <VendorsList />;
}

function VendorsList() {
  const { data: vendors, isLoading } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-vendors-title">
          Vendor Portal
        </h1>
        <p className="text-muted-foreground">
          Healthcare AI products under evaluation.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="h-6 w-48 mb-3" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !vendors || vendors.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No vendors yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {vendors.map((v) => (
            <Link key={v.id} href={`/vendors/${v.id}`}>
              <Card className="cursor-pointer hover-elevate" data-testid={`card-vendor-${v.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{v.name}</h3>
                          <p className="text-sm text-muted-foreground">{v.company} — {v.product}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{v.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <Badge
                          variant="outline"
                          className={EVIDENCE_COLORS[v.evidenceLevel] || ""}
                        >
                          {v.evidenceLevel} evidence
                        </Badge>
                        <Badge variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          {v.documentCount} docs
                        </Badge>
                        {v.expectedBadge && (
                          <Badge variant="secondary" className="text-xs">
                            Expected: {v.expectedBadge}
                          </Badge>
                        )}
                      </div>
                    </div>
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
