import { useState } from "react";
import Topbar from "@/components/Topbar";
import ProblemsTable from "@/components/ProblemsTable";
import { useLocation } from "wouter";
import { useRecoilValue } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import AuthModal from "@/components/Modals/AuthModal";

export default function Home() {
  const [location] = useLocation();
  const authModal = useRecoilValue(authModalState);
  const [loadingProblems, setLoadingProblems] = useState(true);

  return (
    <div className="min-h-screen bg-dark-layer-2" data-testid="home-page">
      <Topbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Practice Coding Problems
          </h1>
          <p className="text-dark-gray-6">
            Enhance your programming skills with our collection of coding challenges
          </p>
        </div>
        
        {loadingProblems ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white">Loading problems...</div>
          </div>
        ) : (
          <ProblemsTable setLoadingProblems={setLoadingProblems} />
        )}
      </div>
      
      {/* Authentication Modal */}
      {authModal.isOpen && <AuthModal />}
    </div>
  );
}
