import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Standards from "@/pages/standards";
import Vendors from "@/pages/vendors";
import Evaluations from "@/pages/evaluations";
import Calibration from "@/pages/calibration";
import Results from "@/pages/results";
import Admin from "@/pages/admin";
import References from "@/pages/references";
import NotFound from "@/pages/not-found";

function AuthenticatedApp() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/standards" component={Standards} />
            <Route path="/standards/:id" component={Standards} />
            <Route path="/vendors" component={Vendors} />
            <Route path="/vendors/:id" component={Vendors} />
            <Route path="/evaluations" component={Evaluations} />
            <Route path="/evaluations/:id" component={Evaluations} />
            <Route path="/calibration" component={Calibration} />
            <Route path="/calibration/:id" component={Calibration} />
            <Route path="/results" component={Results} />
            <Route path="/admin" component={Admin} />
            <Route path="/references" component={References} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse space-y-3 text-center">
          <div className="h-12 w-12 rounded-xl bg-primary/20 mx-auto" />
          <p className="text-sm text-muted-foreground">Loading TRIAH...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
