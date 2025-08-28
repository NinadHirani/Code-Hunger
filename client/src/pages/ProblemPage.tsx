import React from "react";
import { useParams } from "wouter";
import Topbar from "@/components/Topbar";
import Workspace from "@/components/Workspace/Workspace";

const ProblemPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <div>Problem not found</div>;
  }

  return (
    <div>
      <Topbar problemPage />
      <Workspace problemSlug={slug} />
    </div>
  );
};

export default ProblemPage;