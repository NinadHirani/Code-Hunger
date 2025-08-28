import { useState } from "react";
import Topbar from "@/components/Topbar";
import { useLocation } from "wouter";
import { useRecoilValue } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import AuthModal from "@/components/Modals/AuthModal";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [location] = useLocation();
  const authModal = useRecoilValue(authModalState);
  
  // Get problems data
  const { data: problems, isLoading } = useQuery({
    queryKey: ['/api/problems']
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-layer-2" data-testid="home-page">
        <Topbar />
        <div className="flex items-center justify-center h-[calc(100vh-50px)]">
          <div className="text-white">Loading problems...</div>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-dark-green-s";
      case "Medium":
        return "text-dark-yellow";
      case "Hard":
        return "text-dark-pink";
      default:
        return "text-dark-yellow";
    }
  };

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
        
        {/* Problems Table */}
        <div className="bg-dark-layer-1 rounded-lg border border-dark-divider-border-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-dark-label-2 uppercase bg-dark-fill-3 border-b border-dark-divider-border-2">
                <tr>
                  <th scope="col" className="px-1 py-3 w-0 font-medium">Status</th>
                  <th scope="col" className="px-6 py-3 font-medium">Title</th>
                  <th scope="col" className="px-6 py-3 font-medium">Difficulty</th>
                  <th scope="col" className="px-6 py-3 font-medium">Category</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {problems && problems.map((problem, idx) => (
                  <tr 
                    className={`${idx % 2 === 1 ? "bg-dark-layer-1" : ""} border-b border-dark-divider-border-2 hover:bg-dark-fill-2 transition-colors`} 
                    key={problem.slug}
                  >
                    <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
                      {/* Status indicator would go here */}
                    </th>
                    <td className="px-6 py-4">
                      <Link
                        href={`/problems/${problem.slug}`}
                        className="hover:text-blue-600 cursor-pointer font-medium"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className={`px-6 py-4 ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </td>
                    <td className="px-6 py-4 text-dark-gray-7">
                      {problem.category || "Algorithm"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Authentication Modal */}
      {authModal.isOpen && <AuthModal />}
    </div>
  );
}
