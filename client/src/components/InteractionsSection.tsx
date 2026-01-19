import { useState, useEffect } from "react";
import { Link } from "wouter";
import { AiFillLike, AiFillDislike, AiFillStar } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";

const getVisitorId = () => {
  if (typeof window === 'undefined') return 'anonymous';
  let visitorId = localStorage.getItem("visitorId");
  if (!visitorId) {
    visitorId = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("visitorId", visitorId);
  }
  return visitorId;
};

type Interaction = {
  problemSlug: string;
  problemTitle: string;
  difficulty: string;
  liked: boolean;
  disliked: boolean;
  starred: boolean;
  solved: boolean;
};

type TabType = 'liked' | 'disliked' | 'starred';

export default function InteractionsSection() {
  const [activeTab, setActiveTab] = useState<TabType>('starred');
  const visitorId = getVisitorId();

  const { data: interactions = [], isLoading } = useQuery({
    queryKey: ['/api/interactions', visitorId],
    queryFn: async () => {
      const res = await fetch(`/api/interactions?visitorId=${visitorId}`);
      return res.json();
    }
  });

  const filteredProblems = interactions.filter((interaction: Interaction) => {
    if (activeTab === 'liked') return interaction.liked;
    if (activeTab === 'disliked') return interaction.disliked;
    if (activeTab === 'starred') return interaction.starred;
    return false;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-[#00b8af]";
      case "Medium":
        return "text-[#ffc01e]";
      case "Hard":
        return "text-[#ff375f]";
      default:
        return "text-[#ffc01e]";
    }
  };

  const tabs = [
    { id: 'starred' as TabType, label: 'Starred', icon: AiFillStar, color: 'text-yellow-500' },
    { id: 'liked' as TabType, label: 'Liked', icon: AiFillLike, color: 'text-blue-500' },
    { id: 'disliked' as TabType, label: 'Disliked', icon: AiFillDislike, color: 'text-red-500' },
  ];

  if (isLoading) {
    return (
      <div className="mb-8 bg-dark-layer-1 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-dark-fill-3 rounded w-1/4 mb-4"></div>
          <div className="h-20 bg-dark-fill-3 rounded"></div>
        </div>
      </div>
    );
  }

  const hasAnyInteractions = interactions.length > 0;

  if (!hasAnyInteractions) {
    return null;
  }

  return (
    <div className="mb-8 bg-dark-layer-1 rounded-lg overflow-hidden">
      <div className="flex border-b border-dark-fill-3">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const count = interactions.filter((i: Interaction) => {
            if (tab.id === 'liked') return i.liked;
            if (tab.id === 'disliked') return i.disliked;
            if (tab.id === 'starred') return i.starred;
            return false;
          }).length;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-dark-fill-3 text-white border-b-2 border-dark-blue-s'
                  : 'text-dark-gray-6 hover:text-white hover:bg-dark-fill-2'
              }`}
            >
              <Icon className={activeTab === tab.id ? tab.color : ''} />
              {tab.label}
              {count > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-dark-fill-2 rounded-full">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="p-4">
        {filteredProblems.length === 0 ? (
          <p className="text-dark-gray-6 text-sm text-center py-4">
            No {activeTab} problems yet. Start exploring problems!
          </p>
        ) : (
          <div className="space-y-2">
            {filteredProblems.map((problem: Interaction) => (
              <Link key={problem.problemSlug} href={`/problems/${problem.problemSlug}`}>
                <div className="flex items-center justify-between p-3 bg-dark-fill-3 rounded-lg hover:bg-dark-fill-2 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-white">{problem.problemTitle}</span>
                    <span className={`text-xs ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {problem.starred && <AiFillStar className="text-yellow-500" />}
                    {problem.liked && <AiFillLike className="text-blue-500" />}
                    {problem.disliked && <AiFillDislike className="text-red-500" />}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
