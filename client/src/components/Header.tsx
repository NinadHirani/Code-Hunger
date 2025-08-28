import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/lib/firebase";
import { Link } from "wouter";

export function Header() {
  const [user, loading, error] = useAuthState(auth);
  const setAuthModal = useSetRecoilState(authModalState);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    try {
      const { signOutUser } = await import("@/lib/firebase");
      await signOutUser();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <>
      <header className="bg-dark-layer-1 border-b border-dark-divider-border-2 sticky top-0 z-50" data-testid="header">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2" data-testid="logo">
              <div className="text-brand-orange text-2xl font-bold">LeetCode</div>
              <span className="text-dark-gray-6 text-sm">Clone</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6" data-testid="nav-main">
              <Link href="/" className="text-dark-gray-7 hover:text-white transition-colors" data-testid="nav-problems">
                Problems
              </Link>
              <a href="#" className="text-dark-gray-6 hover:text-dark-gray-7 transition-colors" data-testid="nav-contest">
                Contest
              </a>
              <a href="#" className="text-dark-gray-6 hover:text-dark-gray-7 transition-colors" data-testid="nav-discuss">
                Discuss
              </a>
              <a href="#" className="text-dark-gray-6 hover:text-dark-gray-7 transition-colors" data-testid="nav-interview">
                Interview
              </a>
            </nav>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block relative">
              <input 
                type="text" 
                placeholder="Search problems..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark-layer-2 border border-dark-divider-border-2 rounded-lg px-4 py-2 w-64 text-sm placeholder-dark-gray-6 focus:outline-none focus:border-brand-orange transition-colors"
                data-testid="search-input"
              />
              <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-gray-6"></i>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <button className="text-dark-gray-6 hover:text-dark-gray-7 transition-colors" data-testid="notifications">
                <i className="fas fa-bell"></i>
              </button>
              
              {user ? (
                <div className="flex items-center space-x-2" data-testid="user-menu">
                  <img 
                    src={user.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full"
                    data-testid="user-avatar"
                  />
                  <span className="text-sm font-medium" data-testid="user-name">
                    {user.displayName || user.email?.split("@")[0] || "User"}
                  </span>
                  <button 
                    onClick={handleSignOut}
                    className="text-xs text-dark-gray-6 hover:text-dark-gray-7 transition-colors ml-2"
                    data-testid="sign-out-btn"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setAuthModal({ isOpen: true, type: "login" })}
                  className="bg-brand-orange hover:bg-brand-orange-s text-black px-4 py-2 rounded text-sm font-medium transition-colors"
                  data-testid="sign-in-btn"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

    </>
  );
}
