import Topbar from "@/components/Topbar";
import ProblemsTable from "@/components/ProblemsTable";

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-layer-2" data-testid="home-page">
      <Topbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Code Hunger
          </h1>
          <p className="text-dark-gray-6">
            Enhance your programming skills with our collection of coding challenges
          </p>
        </div>
        
        <ProblemsTable />
      </div>
    </div>
  );
}
