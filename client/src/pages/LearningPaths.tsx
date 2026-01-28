import Topbar from "@/components/Topbar";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { FaGraduationCap, FaChevronRight, FaPlay } from "react-icons/fa";
import type { LearningPath } from "@shared/schema";

export default function LearningPaths() {
  const { data: paths, isLoading } = useQuery<LearningPath[]>({
    queryKey: ["/api/learning-paths"],
  });

  return (
    <div className="min-h-screen bg-dark-layer-2">
      <Topbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/10 border border-brand-orange/20 rounded-full mb-6">
            <FaGraduationCap className="text-brand-orange" />
            <span className="text-brand-orange text-sm font-medium">Master New Skills</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Learning Paths</h1>
          <p className="text-dark-gray-7 text-lg">Structured curriculum designed by experts to take you from zero to hero.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-dark-layer-1 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paths?.map((path, idx) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-dark-layer-1 border border-dark-divider-border-2 rounded-2xl overflow-hidden hover:border-brand-orange/50 transition-all cursor-pointer"
              >
                <div className="h-40 relative">
                  <img src={path.image || ""} alt={path.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-layer-1 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">{path.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-dark-gray-7 mb-6 line-clamp-2">{path.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-gray-6">
                      {(path.problems as any[]).length} Modules
                    </span>
                    <Link href={`/learning-paths/${path.id}`}>
                      <button className="flex items-center gap-2 px-4 py-2 bg-brand-orange/10 text-brand-orange rounded-lg hover:bg-brand-orange hover:text-white transition-all text-sm font-bold">
                        <FaPlay className="text-xs" /> Start Learning
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
