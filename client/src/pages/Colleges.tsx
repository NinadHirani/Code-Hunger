import Topbar from "@/components/Topbar";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaUniversity, FaUsers, FaTrophy } from "react-icons/fa";
import type { College } from "@shared/schema";

export default function Colleges() {
  const { data: colleges, isLoading } = useQuery<College[]>({
    queryKey: ["/api/colleges"],
  });

  return (
    <div className="min-h-screen bg-dark-layer-2">
      <Topbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/10 border border-brand-orange/20 rounded-full mb-6">
            <FaUniversity className="text-brand-orange" />
            <span className="text-brand-orange text-sm font-medium">Campus Community</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">College Hub</h1>
          <p className="text-dark-gray-7 text-lg">Connect with your peers and compete with other institutions.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-dark-layer-1 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {colleges?.map((college, idx) => (
              <motion.div
                key={college.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-dark-layer-1 border border-dark-divider-border-2 rounded-2xl p-6 hover:border-brand-orange/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white rounded-xl p-2 flex items-center justify-center">
                    <img src={college.logo || ""} alt={college.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{college.name}</h3>
                    <p className="text-dark-gray-6 text-sm">{college.domain}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-dark-layer-2 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-dark-gray-7 text-xs mb-1">
                      <FaUsers /> Members
                    </div>
                    <div className="text-white font-bold">1.2k</div>
                  </div>
                  <div className="bg-dark-layer-2 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-dark-gray-7 text-xs mb-1">
                      <FaTrophy /> Rank
                    </div>
                    <div className="text-white font-bold">#4</div>
                  </div>
                </div>
                <button className="w-full py-2 bg-dark-layer-2 hover:bg-brand-orange text-white rounded-lg transition-all font-medium border border-dark-divider-border-2">
                  View Community
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
