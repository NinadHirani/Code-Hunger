import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Problem } from "@shared/schema";

interface ProblemDescriptionProps {
  problemSlug: string;
}

export function ProblemDescription({ problemSlug }: ProblemDescriptionProps) {
  const [liked, setLiked] = useState(false);

  const { data: problem, isLoading, error } = useQuery<Problem>({
    queryKey: ["/api/problems", problemSlug],
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-dark-green-s text-black";
      case "Medium": return "bg-dark-yellow text-black";
      case "Hard": return "bg-dark-pink text-white";
      default: return "bg-dark-gray-6 text-white";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6" data-testid="problem-loading">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-dark-layer-2 rounded w-3/4"></div>
          <div className="h-6 bg-dark-layer-2 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-dark-layer-2 rounded"></div>
            <div className="h-4 bg-dark-layer-2 rounded"></div>
            <div className="h-4 bg-dark-layer-2 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="p-6" data-testid="problem-error">
        <div className="text-center py-8">
          <i className="fas fa-exclamation-triangle text-dark-pink text-2xl mb-2"></i>
          <p className="text-dark-gray-6">Problem not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="problem-description">
      {/* Problem Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold" data-testid="problem-title">{problem.title}</h1>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setLiked(!liked)}
              className={`transition-colors ${liked ? 'text-brand-orange' : 'text-dark-gray-6 hover:text-brand-orange'}`}
              data-testid="like-button"
            >
              <i className={`fas ${liked ? 'fa-heart' : 'fa-heart'}`}></i>
            </button>
            <button className="text-dark-gray-6 hover:text-brand-orange transition-colors" data-testid="share-button">
              <i className="fas fa-share"></i>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <span className={`px-3 py-1 rounded text-sm font-medium ${getDifficultyColor(problem.difficulty)}`} data-testid="difficulty-badge">
            {problem.difficulty}
          </span>
          {problem.topics?.map(topic => (
            <span key={topic} className="text-dark-gray-6 text-sm" data-testid={`topic-${topic.toLowerCase().replace(/\s+/g, '-')}`}>
              {topic}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-6 text-sm text-dark-gray-6">
          <span data-testid="acceptance-rate">Acceptance: {problem.acceptance}%</span>
          <span data-testid="submissions-count">Submissions: {problem.submissions?.toLocaleString() || 0}</span>
          <span data-testid="accepted-count">Accepted: {problem.accepted?.toLocaleString() || 0}</span>
        </div>
      </div>

      {/* Problem Description */}
      <div className="prose prose-invert max-w-none">
        <div 
          className="text-dark-gray-7 mb-6 whitespace-pre-wrap" 
          data-testid="problem-statement"
          dangerouslySetInnerHTML={{ __html: String(problem.description).replace(/\n/g, '<br/>') }}
        />

        {/* Examples */}
        {problem.examples && Array.isArray(problem.examples) && problem.examples.length > 0 && (
          <div className="space-y-4" data-testid="examples">
            {(problem.examples as any[]).map((example: any, index: number) => (
              <div key={index}>
                <h3 className="text-white font-semibold mb-2" data-testid={`example-${index + 1}-title`}>
                  Example {index + 1}:
                </h3>
                <div className="bg-dark-layer-2 p-4 rounded-lg" data-testid={`example-${index + 1}-content`}>
                  <div className="font-mono text-sm">
                    <div><strong>Input:</strong> {example.input}</div>
                    <div><strong>Output:</strong> {example.output}</div>
                    {example.explanation && (
                      <div><strong>Explanation:</strong> {example.explanation}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Constraints */}
        {problem.constraints && Array.isArray(problem.constraints) && problem.constraints.length > 0 && (
          <div className="mt-6" data-testid="constraints">
            <h3 className="text-white font-semibold mb-2">Constraints:</h3>
            <ul className="text-dark-gray-7 text-sm space-y-1">
              {problem.constraints.map((constraint, index) => (
                <li key={index} data-testid={`constraint-${index}`}>
                  {constraint}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
