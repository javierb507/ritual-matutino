import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import RoutineApp from "@/pages/RoutineApp";
import { LanguageContext, useLanguage } from "@/lib/i18n";

function Router() {
  return (
    <Switch>
      <Route path="/" component={RoutineApp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const languageValue = useLanguage();
  return (
    <LanguageContext.Provider value={languageValue}>
      {children}
    </LanguageContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Router />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
