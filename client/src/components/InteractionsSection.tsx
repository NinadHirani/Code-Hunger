import { useState } from "react";
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
    <div className="mb-10 bg-dark-layer-1/80 backdrop-blur-sm rounded-2xl border border-dark-divider-border-2 overflow-hidden shadow-lg shadow-black/10">
      <div className="flex border-b border-dark-divider-border-2/50">
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
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-all duration-200 relative ${
                activeTab === tab.id
                  ? 'text-white bg-dark-fill-3/50'
                  : 'text-dark-gray-6 hover:text-white hover:bg-dark-fill-2/50'
              }`}
            >
              <Icon className={`text-lg ${activeTab === tab.id ? tab.color : ''}`} />
              {tab.label}
              {count > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-brand-orange/20 text-brand-orange rounded-full font-semibold">
                  {count}
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-orange to-dark-yellow" />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="p-5">
        {filteredProblems.length === 0 ? (
          <p className="text-dark-gray-6 text-sm text-center py-6">
            No {activeTab} problems yet. Start exploring problems!
          </p>
        ) : (
          <div className="space-y-3">
            {filteredProblems.map((problem: Interaction) => (
              <Link key={problem.problemSlug} href={`/problems/${problem.problemSlug}`}>
                <div className="flex items-center justify-between p-4 bg-dark-fill-3/30 rounded-xl hover:bg-dark-fill-2/60 transition-all duration-200 cursor-pointer border border-transparent hover:border-dark-divider-border-2/50 group">
                  <div className="flex items-center gap-4">
                    <span className="text-white font-medium group-hover:text-brand-orange transition-colors">{problem.problemTitle}</span>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      problem.difficulty === 'Easy' 
                        ? 'bg-dark-green-s/20 text-dark-green-s' 
                        : problem.difficulty === 'Medium' 
                        ? 'bg-dark-yellow/20 text-dark-yellow' 
                        : 'bg-dark-pink/20 text-dark-pink'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {problem.starred && <AiFillStar className="text-yellow-500 text-lg" />}
                    {problem.liked && <AiFillLike className="text-blue-500 text-lg" />}
                    {problem.disliked && <AiFillDislike className="text-red-500 text-lg" />}
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
