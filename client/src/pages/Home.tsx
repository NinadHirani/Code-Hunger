import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ProblemDescription } from "@/components/ProblemDescription";
import { CodeEditor } from "@/components/CodeEditor";
import { useLocation } from "wouter";

export default function Home() {
  const [location] = useLocation();
  
  // Extract problem slug from URL
  const problemSlug = location.startsWith("/problems/") 
    ? location.replace("/problems/", "") 
    : "two-sum"; // Default to first problem

  return (
    <div className="min-h-screen bg-dark-layer-2 text-dark-gray-8" data-testid="home-page">
      <Header />
      
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 flex" data-testid="main-content">
          {/* Problem Description Panel */}
          <div className="w-1/2 bg-dark-layer-1 border-r border-dark-divider-border-2 overflow-y-auto" data-testid="problem-panel">
            <ProblemDescription problemSlug={problemSlug} />
          </div>

          {/* Code Editor Panel */}
          <div className="w-1/2" data-testid="editor-panel">
            <CodeEditor problemSlug={problemSlug} />
          </div>
        </main>
      </div>
    </div>
  );
}
