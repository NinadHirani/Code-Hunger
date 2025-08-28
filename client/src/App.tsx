import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { RecoilRoot } from "recoil";
import { ToastContainer, toast } from "react-toastify";
import { handleRedirectResult } from "@/lib/firebase";
import Home from "@/pages/Home";
import ProblemPage from "@/pages/ProblemPage";
import NotFound from "@/pages/not-found";
import "react-toastify/dist/ReactToastify.css";

function Router() {
  useEffect(() => {
    // Handle Firebase redirect result when user comes back from Google sign-in
    handleRedirectResult()
      .then((result) => {
        if (result && result.user) {
          toast.success(`Welcome, ${result.user.displayName || result.user.email}!`);
        }
      })
      .catch((error) => {
        if (error.code !== 'auth/no-redirect-result') {
          console.error('Sign-in error:', error);
          toast.error('Failed to sign in. Please try again.');
        }
      });
  }, []);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/problems/:slug" component={ProblemPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
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
            </div>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
