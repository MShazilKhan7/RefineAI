import {
  Switch,
  Route,
  Router as WouterRouter,
  Redirect,
} from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { JobList } from "@/pages/job-list";
import { CreateJob } from "@/pages/create-job";
import { JobDetail } from "@/pages/job-detail";
import Login from "./pages/login";
import { ProtectedRoute } from "./components/protectedroute";
import { PublicRoute } from "./components/publicroute";
import Signup from "./pages/signup";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/login">
        <PublicRoute>
          <Login />
        </PublicRoute>
      </Route>
      <Route path="/signup">
        <PublicRoute>
          <Signup />
        </PublicRoute>
      </Route>

      {/* Protected Routes */}
      <Route path="/">
        <ProtectedRoute>
          <JobList />
        </ProtectedRoute>
      </Route>
      <Route path="/jobs/new">
        <ProtectedRoute>
          <CreateJob />
        </ProtectedRoute>
      </Route>
      <Route path="/jobs/:id">
        <ProtectedRoute>
          <JobDetail />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Toaster />  {/* ← moved inside WouterRouter */}
          <Router />
          {/* ← AuthProvider removed from here */}
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;