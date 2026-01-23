import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastContainer } from "react-toastify";
import Home from "@/pages/Home";
import ProblemPage from "@/pages/ProblemPage";
import Submissions from "@/pages/Submissions";
import Contests from "@/pages/Contests";
import ContestDetails from "@/pages/ContestDetails";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import { Chatbot } from "@/components/Chatbot";
import "react-toastify/dist/ReactToastify.css";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/submissions" component={Submissions} />
      <Route path="/contests" component={Contests} />
      <Route path="/contests/:id" component={ContestDetails} />
      <Route path="/profile" component={Profile} />
      <Route path="/problems/:slug" component={ProblemPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen">
          <Toaster />
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Router />
          <Chatbot />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
