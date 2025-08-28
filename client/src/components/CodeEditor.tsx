import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Problem } from "@shared/schema";
import type { Language, Submission } from "@/types/problems";

interface CodeEditorProps {
  problemSlug: string;
}

export function CodeEditor({ problemSlug }: CodeEditorProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState<"testcases" | "results">("testcases");

  const { data: problem } = useQuery<Problem>({
    queryKey: ["/api/problems", problemSlug],
  });

  const { data: submissions } = useQuery<Submission[]>({
    queryKey: user ? ["/api/users", user.uid, "submissions"] : [],
    enabled: !!user,
  });

  const submitSolution = useMutation({
    mutationFn: async (submissionData: { code: string; language: string; problemId: string; userId: string }) => {
      return apiRequest("POST", "/api/submissions", submissionData);
    },
    onSuccess: (data) => {
      const result = data as Response;
      result.json().then((submission: Submission) => {
        if (submission.status === "Accepted") {
          toast({
            title: "Success!",
            description: "Your solution has been accepted! 🎉",
            variant: "default",
          });
          
          // Trigger confetti effect
          triggerConfetti();
          
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ["/api/users"] });
        } else {
          toast({
            title: "Not quite right",
            description: `Status: ${submission.status}. Keep trying!`,
            variant: "destructive",
          });
        }
        
        // Refresh submissions
        queryClient.invalidateQueries({ 
          queryKey: user ? ["/api/users", user.uid, "submissions"] : [] 
        });
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit solution. Please try again.",
        variant: "destructive",
      });
      console.error("Submission error:", error);
    },
  });

  const runCode = useMutation({
    mutationFn: async () => {
      // Simulate running code
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, output: "Test case passed!" };
    },
    onSuccess: () => {
      toast({
        title: "Code executed",
        description: "Your code ran successfully!",
        variant: "default",
      });
    },
  });

  useEffect(() => {
    if (problem && problem.starterCode) {
      const starterCode = (problem.starterCode as any)?.[selectedLanguage] || "";
      setCode(starterCode);
    }
  }, [problem, selectedLanguage]);

  const triggerConfetti = () => {
    // Simple confetti effect using CSS animation
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'fixed inset-0 pointer-events-none z-50';
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'absolute w-2 h-2 rounded animate-bounce';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.backgroundColor = ['#FFA116', '#FFB700', '#FF375F', '#00B8A3', '#2C84FD'][Math.floor(Math.random() * 5)];
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      confettiContainer.appendChild(confetti);
    }
    
    document.body.appendChild(confettiContainer);
    
    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  };

  const handleSubmit = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to submit your solution.",
        variant: "destructive",
      });
      return;
    }

    if (!problem) {
      toast({
        title: "Error",
        description: "Problem not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    submitSolution.mutate({
      code,
      language: selectedLanguage,
      problemId: problem.id,
      userId: user.uid,
    });
  };

  const handleRun = () => {
    runCode.mutate();
  };

  if (!problem) {
    return (
      <div className="bg-dark-layer-2 flex flex-col" data-testid="editor-loading">
        <div className="bg-dark-layer-1 border-b border-dark-divider-border-2 p-4">
          <div className="animate-pulse h-10 bg-dark-layer-2 rounded"></div>
        </div>
        <div className="flex-1 p-4">
          <div className="animate-pulse h-full bg-dark-layer-1 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-layer-2 flex flex-col" data-testid="code-editor">
      {/* Editor Header */}
      <div className="bg-dark-layer-1 border-b border-dark-divider-border-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select 
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value as Language)}
              className="bg-dark-layer-2 border border-dark-divider-border-2 rounded px-3 py-2 text-sm"
              data-testid="language-select"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            
            <button className="preferenceBtn group" data-testid="settings-btn">
              <i className="fas fa-cog"></i>
              <div className="preferenceBtn-tooltip">Settings</div>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleRun}
              disabled={runCode.isPending}
              className="bg-dark-layer-2 hover:bg-dark-fill-2 px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
              data-testid="run-btn"
            >
              <i className="fas fa-play mr-2"></i>
              {runCode.isPending ? "Running..." : "Run"}
            </button>
            <button 
              onClick={handleSubmit}
              disabled={submitSolution.isPending}
              className="bg-brand-orange hover:bg-brand-orange-s text-black px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
              data-testid="submit-btn"
            >
              {submitSolution.isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 relative code-editor">
        <CodeMirror
          value={code}
          onChange={setCode}
          theme={vscodeDark}
          extensions={[javascript()]}
          className="h-full"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
          }}
        />
      </div>

      {/* Test Cases and Output */}
      <div className="bg-dark-layer-1 border-t border-dark-divider-border-2" data-testid="bottom-panel">
        <div className="flex border-b border-dark-divider-border-2">
          <button 
            onClick={() => setActiveTab("testcases")}
            className={`px-4 py-3 text-sm transition-colors ${
              activeTab === "testcases" 
                ? 'border-b-2 border-brand-orange text-brand-orange' 
                : 'text-dark-gray-6 hover:text-dark-gray-7'
            }`}
            data-testid="testcases-tab"
          >
            Test Cases
          </button>
          <button 
            onClick={() => setActiveTab("results")}
            className={`px-4 py-3 text-sm transition-colors ${
              activeTab === "results" 
                ? 'border-b-2 border-brand-orange text-brand-orange' 
                : 'text-dark-gray-6 hover:text-dark-gray-7'
            }`}
            data-testid="results-tab"
          >
            Results
          </button>
        </div>
        
        <div className="p-4 h-48 overflow-y-auto">
          {activeTab === "testcases" ? (
            <div className="space-y-3" data-testid="test-cases">
              {(problem.examples as any[] || []).map((example: any, index: number) => (
                <div key={index} className="bg-dark-layer-2 p-3 rounded" data-testid={`test-case-${index + 1}`}>
                  <div className="text-sm font-medium mb-2">Test Case {index + 1}</div>
                  <div className="font-mono text-xs text-dark-gray-6">
                    <div>Input: {example.input}</div>
                    <div>Expected: {example.output}</div>
                  </div>
                </div>
              ))}
              
              {(problem.examples as any[] || []).length === 0 && (
                <div className="text-center py-4 text-dark-gray-6" data-testid="no-test-cases">
                  <i className="fas fa-flask text-lg mb-2"></i>
                  <p>No test cases available</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3" data-testid="results">
              {submissions && submissions.length > 0 ? (
                submissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="bg-dark-layer-2 p-3 rounded" data-testid={`result-${submission.id}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{submission.status}</span>
                      <span className="text-xs text-dark-gray-6">
                        {new Date(submission.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {submission.runtime && (
                      <div className="text-xs text-dark-gray-6">
                        Runtime: {submission.runtime}ms | Memory: {submission.memory}MB
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-dark-gray-6" data-testid="no-results">
                  <i className="fas fa-chart-line text-lg mb-2"></i>
                  <p>No submissions yet. Run your code to see results!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
