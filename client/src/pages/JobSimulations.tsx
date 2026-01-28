import Topbar from "@/components/Topbar";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaBriefcase, FaBuilding, FaClock } from "react-icons/fa";
import type { JobSimulation } from "@shared/schema";

export default function JobSimulations() {
  const { data: simulations, isLoading } = useQuery<JobSimulation[]>({
    queryKey: ["/api/job-simulations"],
  });

  return (
    <div className="min-h-screen bg-dark-layer-2">
      <Topbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/10 border border-brand-orange/20 rounded-full mb-6">
            <FaBriefcase className="text-brand-orange" />
            <span className="text-brand-orange text-sm font-medium">Interview Readiness</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Job Simulations</h1>
          <p className="text-dark-gray-7 text-lg">Practice with real interview scenarios from top tech companies.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-dark-layer-1 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {simulations?.map((sim, idx) => (
              <motion.div
                key={sim.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-dark-layer-1 border border-dark-divider-border-2 rounded-3xl p-8 hover:border-brand-orange/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-brand-orange/10 transition-all" />
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl p-3 flex items-center justify-center shadow-lg">
                      <img src={sim.logo || ""} alt={sim.companyName} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{sim.companyName}</h3>
                      <p className="text-brand-orange font-medium">{sim.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-dark-layer-2 rounded-full text-dark-gray-6 text-sm border border-dark-divider-border-2">
                    <FaClock className="text-xs" /> {sim.duration}m
                  </div>
                </div>

                <p className="text-dark-gray-7 mb-8 text-lg leading-relaxed relative z-10">{sim.description}</p>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-dark-layer-1 bg-dark-layer-2 flex items-center justify-center text-[10px] text-dark-gray-6 font-bold">
                          P{i}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-dark-gray-6">{sim.problemIds?.length} Problems</span>
                  </div>
                  <button className="px-6 py-2 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-orange/20">
                    Start Simulation
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
