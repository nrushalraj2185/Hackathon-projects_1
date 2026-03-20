import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/contexts/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";

import Dashboard from "@/pages/Dashboard";
import Crops from "@/pages/Crops";
import CropHealth from "@/pages/CropHealth";
import Marketplace from "@/pages/Marketplace";
import Farm from "@/pages/Farm";
import Weather from "@/pages/Weather";
import Labor from "@/pages/Labor";
import Equipment from "@/pages/Equipment";
import Transport from "@/pages/Transport";
import Schemes from "@/pages/Schemes";
import Sensors from "@/pages/Sensors";
import Alerts from "@/pages/Alerts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});


function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/crops" component={Crops} />
        <Route path="/health" component={CropHealth} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/farm" component={Farm} />
        <Route path="/weather" component={Weather} />
        <Route path="/labor" component={Labor} />
        <Route path="/equipment" component={Equipment} />
        <Route path="/transport" component={Transport} />
        <Route path="/schemes" component={Schemes} />
        <Route path="/sensors" component={Sensors} />
        <Route path="/alerts" component={Alerts} />
        <Route>
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-muted-foreground">Page not found</p>
          </div>
        </Route>
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
