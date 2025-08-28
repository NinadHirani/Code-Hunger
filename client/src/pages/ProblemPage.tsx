import React from "react";
import { useParams } from "wouter";
import Topbar from "@/components/Topbar/Topbar";
import Workspace from "@/components/Workspace/Workspace";

const ProblemPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return (
      <div className="min-h-screen bg-dark-layer-2">
        <Topbar problemPage />
        <div className="flex items-center justify-center h-[calc(100vh-50px)]">
          <div className="text-white">Problem not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-layer-2">
      <Topbar problemPage />
      <Workspace problemSlug={slug} />
    </div>
  );
};

export default ProblemPage;