import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn();
      onClose();
      toast({
        title: "Welcome!",
        description: "You've successfully signed in with Google.",
        variant: "default",
      });
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
      data-testid="auth-modal-overlay"
    >
      <div 
        className="bg-dark-layer-1 rounded-lg p-8 w-96 max-w-md"
        onClick={(e) => e.stopPropagation()}
        data-testid="auth-modal"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold" data-testid="modal-title">Sign In</h2>
          <p className="text-dark-gray-6 mt-2" data-testid="modal-subtitle">
            Welcome to LeetCode Clone
          </p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-brand-orange hover:bg-brand-orange-s disabled:opacity-50 text-black py-3 rounded font-medium transition-colors flex items-center justify-center space-x-2"
            data-testid="google-signin-btn"
          >
            <i className="fab fa-google"></i>
            <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
          </button>
          
          <div className="text-center">
            <button 
              onClick={onClose}
              className="text-dark-gray-6 hover:text-dark-gray-7 text-sm transition-colors"
              data-testid="close-modal-btn"
            >
              Cancel
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-dark-gray-6 text-sm">
            By continuing, you agree to our{" "}
            <a href="#" className="text-brand-orange hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-brand-orange hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
