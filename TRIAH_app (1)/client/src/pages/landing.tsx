import { Shield, CheckCircle2, Users, BarChart3, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "8 Comprehensive Standards",
    description: "Evaluate AI products across regulatory compliance, clinical outcomes, transparency, ethics, model validity, and more.",
  },
  {
    icon: Users,
    title: "Multi-Evaluator Scoring",
    description: "Independent evaluations by expert reviewers with calibration exercises to ensure scoring consistency.",
  },
  {
    icon: BarChart3,
    title: "IRR Analytics",
    description: "Inter-rater reliability metrics including Cohen's Kappa, Fleiss' Kappa, ICC, and Cronbach's Alpha.",
  },
  {
    icon: Award,
    title: "Badge Certification",
    description: "Tiered certification badges from Bronze to Platinum based on weighted scores and must-pass requirements.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-1 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">TRIAH</span>
          </div>
          <a href="/api/login">
            <Button data-testid="button-login">Sign In</Button>
          </a>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Trusted AI Validation
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-tight" data-testid="text-hero-title">
              Independent Validation for Healthcare AI
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              TRIAH provides a rigorous, transparent framework for evaluating AI products in healthcare.
              235+ factors across 8 standards ensure comprehensive, reproducible certification.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="/api/login">
                <Button size="lg" data-testid="button-get-started">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                FDA/CE aligned
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                ISO 14971 compliant
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                CHAI compatible
              </span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl" />
            <div className="relative p-8 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {["Platinum", "Gold", "Silver", "Bronze"].map((badge, i) => {
                  const colors = [
                    "from-slate-400 to-slate-300",
                    "from-amber-400 to-yellow-300",
                    "from-gray-300 to-gray-200",
                    "from-orange-500 to-amber-400",
                  ];
                  const scores = ["90%+", "80%+", "70%+", "60%+"];
                  return (
                    <div
                      key={badge}
                      className="bg-card rounded-lg p-4 space-y-2"
                      data-testid={`badge-preview-${badge.toLowerCase()}`}
                    >
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${colors[i]} flex items-center justify-center`}>
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <p className="font-medium text-sm">{badge}</p>
                      <p className="text-xs text-muted-foreground">{scores[i]} overall score</p>
                    </div>
                  );
                })}
              </div>
              <div className="bg-card rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">Framework Coverage</p>
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-2 rounded-full bg-primary/20">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${70 + Math.random() * 30}%` }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">8 standards with weighted scoring</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-serif font-bold tracking-tight" data-testid="text-features-title">
              A Complete Evaluation Platform
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              Everything you need to validate healthcare AI products with scientific rigor.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <Card key={f.title} className="bg-card" data-testid={`card-feature-${f.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="p-5 space-y-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-1 text-sm text-muted-foreground">
          <p>TRIAH Validation Framework</p>
          <p>Trusted Review for Intelligent AI in Healthcare</p>
        </div>
      </footer>
    </div>
  );
}
