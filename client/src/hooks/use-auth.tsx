import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { auth, handleRedirectResult, signInWithGoogle, signOutUser, User } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Create or update user in our backend
        try {
          await apiRequest("POST", "/api/users", {
            email: firebaseUser.email,
            username: firebaseUser.email?.split("@")[0] || "user",
            displayName: firebaseUser.displayName || "User",
            avatar: firebaseUser.photoURL,
          });
        } catch (error) {
          console.error("Failed to create/update user:", error);
        }
        
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Handle redirect result
    handleRedirectResult().then((result) => {
      if (result?.user) {
        // User signed in successfully
        console.log("User signed in via redirect");
      }
    }).catch((error) => {
      console.error("Error handling redirect result:", error);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
