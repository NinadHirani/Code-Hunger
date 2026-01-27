import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import Topbar from '@/components/Topbar';
import { Contest, Problem, ContestParticipant } from '@shared/schema';
import { format, differenceInSeconds } from 'date-fns';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserGraduate, FaTrophy, FaLock, FaRobot } from 'react-icons/fa';

const ContestDetails = () => {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  
  const { data: contest, isLoading: isContestLoading } = useQuery<Contest>({
    queryKey: [`/api/contests/${id}`],
  });

  const { data: leaderboard, isLoading: isLeaderboardLoading } = useQuery<ContestParticipant[]>({
    queryKey: [`/api/contests/${id}/leaderboard`],
    refetchInterval: isInterviewMode ? false : 5000, // Poll every 5s unless in interview mode
  });

  const { data: allProblems } = useQuery<Problem[]>({
    queryKey: ['/api/problems'],
  });

  const contestProblems = allProblems?.filter(p => contest?.problemIds?.includes(p.slug)) || [];

  const joinMutation = useMutation({
    mutationFn: async () => {
      const visitorId = localStorage.getItem('visitorId') || 'anonymous';
      return apiRequest('POST', `/api/contests/${id}/join`, { userId: visitorId });
    },
    onSuccess: () => {
      toast.success('Joined contest successfully!');
      queryClient.invalidateQueries({ queryKey: [`/api/contests/${id}/leaderboard`] });
    },
  });

  const secureMutation = useMutation({
    mutationFn: async (score: number) => {
      const visitorId = localStorage.getItem('visitorId') || 'anonymous';
      return apiRequest('POST', `/api/contests/${id}/secure`, { userId: visitorId, score });
    },
    onSuccess: (data: any) => {
      toast.info(`Results secured on blockchain! Hash: ${data.hash.substring(0, 16)}...`);
    }
  });

  useEffect(() => {
    if (contest) {
      const timer = setInterval(() => {
        const seconds = differenceInSeconds(new Date(contest.endTime), new Date());
        setTimeLeft(Math.max(0, seconds));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [contest]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isContestLoading) return <div className='bg-dark-layer-2 min-h-screen text-white p-10'>Loading...</div>;

  return (
    <main className='bg-dark-layer-2 min-h-screen pb-10'>
      <Topbar />
      <div className='max-w-[1200px] mx-auto px-6 py-10'>
        <div className='flex flex-col md:flex-row justify-between items-start gap-8'>
          <div className='flex-1'>
            <div className='flex items-center gap-4 mb-2'>
              <h1 className='text-4xl font-bold text-white'>{contest?.title}</h1>
              <button 
                onClick={() => setIsInterviewMode(!isInterviewMode)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition ${
                  isInterviewMode ? 'bg-purple-500 text-white' : 'bg-dark-fill-3 text-gray-400'
                }`}
              >
                <FaRobot /> {isInterviewMode ? 'Interview Mode ON' : 'Interview Mode'}
              </button>
            </div>
            <p className='text-gray-400 text-lg mb-6'>{contest?.description}</p>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-10'>
              <div className='bg-dark-layer-1 p-4 rounded-xl border border-dark-fill-3'>
                <p className='text-gray-500 text-sm'>Time Remaining</p>
                <p className='text-2xl font-mono font-bold text-brand-orange'>{formatTime(timeLeft)}</p>
              </div>
              <div className='bg-dark-layer-1 p-4 rounded-xl border border-dark-fill-3'>
                <p className='text-gray-500 text-sm'>Participants</p>
                <p className='text-2xl font-bold text-white'>{leaderboard?.length || 0}</p>
              </div>
              <div className='bg-dark-layer-1 p-4 rounded-xl border border-dark-fill-3'>
                <p className='text-gray-500 text-sm'>Problems</p>
                <p className='text-2xl font-bold text-white'>{contest?.problemIds?.length || 0}</p>
              </div>
            </div>

            <h2 className='text-2xl font-bold text-white mb-4'>Problems</h2>
            <div className='space-y-3'>
              {contestProblems.map((problem, idx) => (
                <Link key={problem.id} href={`/problems/${problem.slug}`}>
                  <div className='bg-dark-layer-1 p-4 rounded-xl border border-dark-fill-3 hover:bg-dark-fill-3 transition flex items-center justify-between group cursor-pointer'>
                    <div className='flex items-center gap-4'>
                      <span className='text-gray-500 font-mono'>{idx + 1}.</span>
                      <span className='text-white font-medium group-hover:text-brand-orange transition'>{problem.title}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      problem.difficulty === 'Easy' ? 'text-olive bg-olive/10' :
                      problem.difficulty === 'Medium' ? 'text-yellow-500 bg-yellow-500/10' :
                      'text-red-500 bg-red-500/10'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className='mt-10'>
              <button 
                onClick={() => joinMutation.mutate()}
                disabled={joinMutation.isPending}
                className='bg-brand-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-orange-s transition disabled:opacity-50'
              >
                {joinMutation.isPending ? 'Joining...' : 'Join Contest'}
              </button>
              
              <button 
                onClick={() => secureMutation.mutate(100)}
                className='ml-4 bg-dark-fill-3 text-gray-300 px-6 py-3 rounded-xl font-bold hover:bg-dark-fill-2 transition flex items-center gap-2 inline-flex'
              >
                <FaLock className='text-blue-400' /> Secure Results (Blockchain)
              </button>
            </div>
          </div>

          <AnimatePresence>
            {!isInterviewMode && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className='w-full md:w-80'
              >
                <div className='bg-dark-layer-1 rounded-xl border border-dark-fill-3 overflow-hidden'>
                  <div className='bg-dark-fill-3 p-4 flex items-center gap-2'>
                    <FaTrophy className='text-yellow-500' />
                    <h3 className='font-bold text-white'>Leaderboard</h3>
                  </div>
                  <div className='p-2 space-y-1'>
                    {leaderboard?.map((p, idx) => (
                      <div key={p.id} className='flex items-center justify-between p-2 rounded hover:bg-dark-fill-3 transition'>
                        <div className='flex items-center gap-3'>
                          <span className={`w-6 text-center font-bold ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-600' : 'text-gray-600'}`}>
                            {idx + 1}
                          </span>
                          <span className='text-gray-300 text-sm'>{p.userId.substring(0, 8)}</span>
                        </div>
                        <span className='text-brand-orange font-bold'>{p.score || 0}</span>
                      </div>
                    ))}
                    {(!leaderboard || leaderboard.length === 0) && (
                      <div className='p-4 text-center text-gray-500 text-sm italic'>No participants yet</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isInterviewMode && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='w-full md:w-80 bg-dark-layer-1 rounded-xl border border-dark-fill-3 p-6'
            >
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center text-white text-2xl'>
                  <FaRobot />
                </div>
                <div>
                  <h3 className='font-bold text-white'>AI Interviewer</h3>
                  <p className='text-xs text-olive'>Online</p>
                </div>
              </div>
              <div className='bg-dark-fill-3 p-4 rounded-lg text-sm text-gray-300 italic mb-4'>
                "Hello! I'll be monitoring your progress today. Focus on clean code and efficient algorithms. I've hidden the leaderboard to minimize distractions. Good luck!"
              </div>
              <div className='space-y-4'>
                <div className='h-2 bg-dark-fill-3 rounded-full overflow-hidden'>
                  <div className='h-full bg-brand-orange transition-all' style={{ width: '30%' }}></div>
                </div>
                <p className='text-xs text-gray-500 text-center uppercase tracking-widest'>Simulation Progress</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ContestDetails;
