import Topbar from "@/components/Topbar";
import ProblemsTable from "@/components/ProblemsTable";
import InteractionsSection from "@/components/InteractionsSection";
import { FaCode, FaFire, FaTrophy, FaCoins, FaChartLine } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { UserStreak, RewardPoint } from "@shared/schema";

export default function Home() {
  const visitorId = localStorage.getItem('visitorId') || 'anonymous';

  const { data: streak } = useQuery<UserStreak>({
    queryKey: [`/api/users/${visitorId}/streak`],
  });

  const { data: rewards } = useQuery<RewardPoint>({
    queryKey: [`/api/users/${visitorId}/rewards`],
  });

  const { data: userProblems } = useQuery<any[]>({
    queryKey: [`/api/users/${visitorId}/problems`],
  });

  const solvedProblems = userProblems?.filter(p => p.solved) || [];
  const easySolved = solvedProblems.filter(p => p.difficulty === 'Easy').length;
  const mediumSolved = solvedProblems.filter(p => p.difficulty === 'Medium').length;
  const hardSolved = solvedProblems.filter(p => p.difficulty === 'Hard').length;

  const totalEasy = userProblems?.filter(p => p.difficulty === 'Easy').length || 0;
  const totalMedium = userProblems?.filter(p => p.difficulty === 'Medium').length || 0;
  const totalHard = userProblems?.filter(p => p.difficulty === 'Hard').length || 0;

  const level = Math.floor((rewards?.points || 0) / 100) + 1;
  const progress = (rewards?.points || 0) % 100;

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
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Problem Set</h2>
                <p className="text-dark-gray-6">Choose a problem and start coding</p>
              </div>
              <ProblemsTable />
            </div>

            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Your Profile</h2>
              
              <div className='bg-dark-layer-1/80 backdrop-blur-sm rounded-2xl p-6 border border-dark-divider-border-2 shadow-xl'>
                <div className='flex flex-col items-center text-center'>
                  <div className='w-20 h-20 rounded-full bg-gradient-to-tr from-brand-orange to-yellow-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4'>
                    {visitorId.charAt(0).toUpperCase()}
                  </div>
                  <h3 className='text-xl font-bold text-white mb-1'>User {visitorId.substring(0, 8)}</h3>
                  <div className='bg-brand-orange/20 text-brand-orange px-3 py-1 rounded-full text-xs font-bold mb-4'>
                    Level {level}
                  </div>
                  
                  <div className='w-full border-t border-dark-divider-border-2 pt-4 mt-2 space-y-4'>
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center gap-2 text-dark-gray-7'>
                        <FaFire className='text-brand-orange' />
                        <span>Streak</span>
                      </div>
                      <span className='text-white font-bold'>{streak?.currentStreak || 0} days</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center gap-2 text-dark-gray-7'>
                        <FaCoins className='text-yellow-500' />
                        <span>Points</span>
                      </div>
                      <span className='text-white font-bold'>{rewards?.points || 0}</span>
                    </div>
                  </div>

                  <div className='w-full mt-6 space-y-2'>
                    <div className='flex justify-between text-xs text-dark-gray-7'>
                      <span>Next Level</span>
                      <span>{progress}/100 XP</span>
                    </div>
                    <div className='h-2 bg-dark-fill-3 rounded-full overflow-hidden'>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className='h-full bg-gradient-to-r from-brand-orange to-dark-yellow'
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-dark-layer-1/80 backdrop-blur-sm rounded-2xl p-6 border border-dark-divider-border-2 shadow-xl'>
                <h3 className='text-white font-bold mb-4 flex items-center gap-2'>
                  <FaChartLine className='text-blue-400' /> Statistics
                </h3>
                <div className='space-y-4'>
                  <div>
                    <div className='flex justify-between text-xs mb-1'>
                      <span className='text-dark-green-s font-medium'>Easy</span>
                      <span className='text-dark-gray-7'>{easySolved}/{totalEasy}</span>
                    </div>
                    <div className='h-1.5 bg-dark-fill-3 rounded-full overflow-hidden'>
                      <div className='h-full bg-dark-green-s' style={{ width: `${(easySolved / (totalEasy || 1)) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className='flex justify-between text-xs mb-1'>
                      <span className='text-dark-yellow font-medium'>Medium</span>
                      <span className='text-dark-gray-7'>{mediumSolved}/{totalMedium}</span>
                    </div>
                    <div className='h-1.5 bg-dark-fill-3 rounded-full overflow-hidden'>
                      <div className='h-full bg-dark-yellow' style={{ width: `${(mediumSolved / (totalMedium || 1)) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className='flex justify-between text-xs mb-1'>
                      <span className='text-dark-pink font-medium'>Hard</span>
                      <span className='text-dark-gray-7'>{hardSolved}/{totalHard}</span>
                    </div>
                    <div className='h-1.5 bg-dark-fill-3 rounded-full overflow-hidden'>
                      <div className='h-full bg-dark-pink' style={{ width: `${(hardSolved / (totalHard || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
