import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import type { ProblemWithStatus } from "@/types/problems";

export function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [topicFilter, setTopicFilter] = useState("All Topics");
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);

  const { data: problems, isLoading } = useQuery<ProblemWithStatus[]>({
    queryKey: user ? ["/api/users", user.uid, "problems"] : ["/api/problems"],
  });

  const toggleDifficultyFilter = (difficulty: string) => {
    setDifficultyFilter(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const filteredProblems = problems?.filter(problem => {
    if (topicFilter !== "All Topics" && !problem.topics.includes(topicFilter)) {
      return false;
    }
    if (difficultyFilter.length > 0 && !difficultyFilter.includes(problem.difficulty)) {
      return false;
    }
    return true;
  }) || [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-dark-green-s text-black";
      case "Medium": return "bg-dark-yellow text-black";
      case "Hard": return "bg-dark-pink text-white";
      default: return "bg-dark-gray-6 text-white";
    }
  };

  const getDifficultyFilterColor = (difficulty: string, isSelected: boolean) => {
    if (!isSelected) {
      return "bg-dark-layer-2 text-dark-gray-6 hover:bg-dark-fill-2";
    }
    switch (difficulty) {
      case "Easy": return "bg-dark-green-s text-black";
      case "Medium": return "bg-dark-yellow text-black";
      case "Hard": return "bg-dark-pink text-white";
      default: return "bg-dark-gray-6 text-white";
    }
  };

  if (isLoading) {
    return (
      <aside className="w-80 bg-dark-layer-1 border-r border-dark-divider-border-2 flex-shrink-0" data-testid="sidebar-loading">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-dark-layer-2 rounded"></div>
            <div className="h-10 bg-dark-layer-2 rounded"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-dark-layer-2 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-dark-layer-1 border-r border-dark-divider-border-2 flex-shrink-0" data-testid="sidebar">
      <div className="p-4">
        {/* Filter Controls */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4" data-testid="problems-title">Problems</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <select 
                value={topicFilter} 
                onChange={(e) => setTopicFilter(e.target.value)}
                className="bg-dark-layer-2 border border-dark-divider-border-2 rounded px-3 py-2 text-sm flex-1"
                data-testid="topic-filter"
              >
                <option>All Topics</option>
                <option>Array</option>
                <option>String</option>
                <option>Hash Table</option>
                <option>Dynamic Programming</option>
                <option>Linked List</option>
                <option>Math</option>
                <option>Binary Search</option>
                <option>Sliding Window</option>
                <option>Divide and Conquer</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              {["Easy", "Medium", "Hard"].map(difficulty => (
                <button 
                  key={difficulty}
                  onClick={() => toggleDifficultyFilter(difficulty)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${getDifficultyFilterColor(difficulty, difficultyFilter.includes(difficulty))}`}
                  data-testid={`filter-${difficulty.toLowerCase()}`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problem List */}
        <div className="space-y-2" data-testid="problems-list">
          {filteredProblems.map(problem => {
            const isActive = location === `/problems/${problem.slug}`;
            return (
              <Link 
                key={problem.id}
                href={`/problems/${problem.slug}`}
                className={`block bg-dark-layer-2 rounded-lg p-3 hover:bg-dark-fill-2 cursor-pointer transition-colors border ${
                  isActive 
                    ? 'border-brand-orange bg-dark-fill-2' 
                    : 'border-transparent hover:border-dark-divider-border-2'
                }`}
                data-testid={`problem-${problem.slug}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{problem.title}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <div className="text-xs text-dark-gray-6 mb-2">
                  {problem.topics.join(", ")}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-dark-gray-6">
                    Acceptance: {problem.acceptance}%
                  </span>
                  <i className={`fas ${problem.solved ? 'fa-check-circle text-dark-green-s' : 'fa-circle text-dark-gray-6'}`}></i>
                </div>
              </Link>
            );
          })}
          
          {filteredProblems.length === 0 && (
            <div className="text-center py-8 text-dark-gray-6" data-testid="no-problems">
              <i className="fas fa-search text-2xl mb-2"></i>
              <p>No problems found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
