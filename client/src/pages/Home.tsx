import Topbar from "@/components/Topbar";
import ProblemsTable from "@/components/ProblemsTable";
import InteractionsSection from "@/components/InteractionsSection";
import FutureScope from "@/components/FutureScope";
import { FaCode, FaFire, FaTrophy } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-layer-2" data-testid="home-page">
      <Topbar />
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 via-transparent to-dark-pink/5 pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-dark-blue-s/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/10 border border-brand-orange/20 rounded-full mb-6">
              <FaFire className="text-brand-orange animate-pulse" />
              <span className="text-brand-orange text-sm font-medium">Level up your coding skills</span>
            </div>
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-dark-yellow">Code Hunger</span>
            </h1>
            <p className="text-dark-gray-7 text-lg max-w-2xl mx-auto">
              Master algorithms and data structures with our curated collection of coding challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="group bg-dark-layer-1/80 backdrop-blur-sm border border-dark-divider-border-2 rounded-2xl p-6 hover:border-brand-orange/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-orange/5">
              <div className="w-12 h-12 bg-gradient-to-br from-dark-green-s to-olive rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaCode className="text-white text-xl" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Practice Daily</h3>
              <p className="text-dark-gray-6 text-sm">Solve problems regularly to build strong coding fundamentals</p>
            </div>
            <div className="group bg-dark-layer-1/80 backdrop-blur-sm border border-dark-divider-border-2 rounded-2xl p-6 hover:border-brand-orange/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-orange/5">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-dark-yellow rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaFire className="text-white text-xl" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Build Streaks</h3>
              <p className="text-dark-gray-6 text-sm">Stay consistent and track your progress over time</p>
            </div>
            <div className="group bg-dark-layer-1/80 backdrop-blur-sm border border-dark-divider-border-2 rounded-2xl p-6 hover:border-brand-orange/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-orange/5">
              <div className="w-12 h-12 bg-gradient-to-br from-dark-pink to-dark-blue-s rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaTrophy className="text-white text-xl" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Ace Interviews</h3>
              <p className="text-dark-gray-6 text-sm">Prepare for technical interviews at top companies</p>
            </div>
          </div>
          
          <InteractionsSection />
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Problem Set</h2>
            <p className="text-dark-gray-6">Choose a problem and start coding</p>
          </div>
          
            <ProblemsTable />
            
            <FutureScope />
          </div>
        </div>
      </div>
    );
  }

