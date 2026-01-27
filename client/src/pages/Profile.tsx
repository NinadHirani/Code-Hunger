import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import Topbar from '@/components/Topbar';
import { UserBadge, UserStreak, RewardPoint } from '@shared/schema';
import { FaFire, FaMedal, FaCoins, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Profile = () => {
  const visitorId = localStorage.getItem('visitorId') || 'anonymous';

  const { data: streak } = useQuery<UserStreak>({
    queryKey: [`/api/users/${visitorId}/streak`],
  });

  const { data: userBadges } = useQuery<any[]>({
    queryKey: [`/api/users/${visitorId}/badges`],
  });

  const { data: rewards } = useQuery<RewardPoint>({
    queryKey: [`/api/users/${visitorId}/rewards`],
  });

  const { data: userProblems } = useQuery<any[]>({
    queryKey: [`/api/users/${visitorId}/problems`],
  });

  const { data: submissions } = useQuery<any[]>({
    queryKey: [`/api/users/${visitorId}/submissions-with-details`],
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
    <main className='bg-dark-layer-2 min-h-screen pb-10'>
      <Topbar />
      <div className='max-w-[1200px] mx-auto px-6 py-10'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          
          {/* Left Sidebar - Profile Info */}
          <div className='lg:col-span-1 space-y-6'>
            <div className='bg-dark-layer-1 rounded-2xl p-6 border border-dark-fill-3'>
              <div className='flex flex-col items-center text-center'>
                <div className='w-24 h-24 rounded-full bg-gradient-to-tr from-brand-orange to-yellow-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4'>
                  {visitorId.charAt(0).toUpperCase()}
                </div>
                <h1 className='text-2xl font-bold text-white mb-1'>User {visitorId.substring(0, 8)}</h1>
                <p className='text-gray-400 text-sm mb-4'>Coding Enthusiast</p>
                
                <div className='w-full border-t border-dark-fill-3 pt-4 mt-2 space-y-3'>
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-400'>Current Streak</span>
                    <div className='flex items-center gap-1 text-brand-orange font-bold'>
                      <FaFire /> {streak?.currentStreak || 0}
                    </div>
                  </div>
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-400'>Points</span>
                    <div className='flex items-center gap-1 text-yellow-500 font-bold'>
                      <FaCoins /> {rewards?.points || 0}
                    </div>
                  </div>
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-400'>Rank</span>
                    <span className='text-white font-bold'>~1,200</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Solved Problems Breakdown */}
            <div className='bg-dark-layer-1 rounded-2xl p-6 border border-dark-fill-3'>
              <h3 className='text-white font-bold mb-4 flex items-center gap-2'>
                <FaChartLine className='text-blue-400' /> Solved Problems
              </h3>
              <div className='space-y-4'>
                <div>
                  <div className='flex justify-between text-xs mb-1'>
                    <span className='text-green-500 font-medium'>Easy</span>
                    <span className='text-gray-400'>{easySolved}/{totalEasy}</span>
                  </div>
                  <div className='h-1.5 bg-dark-fill-3 rounded-full overflow-hidden'>
                    <div className='h-full bg-green-500' style={{ width: `${(easySolved / (totalEasy || 1)) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className='flex justify-between text-xs mb-1'>
                    <span className='text-yellow-500 font-medium'>Medium</span>
                    <span className='text-gray-400'>{mediumSolved}/{totalMedium}</span>
                  </div>
                  <div className='h-1.5 bg-dark-fill-3 rounded-full overflow-hidden'>
                    <div className='h-full bg-yellow-500' style={{ width: `${(mediumSolved / (totalMedium || 1)) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className='flex justify-between text-xs mb-1'>
                    <span className='text-red-500 font-medium'>Hard</span>
                    <span className='text-gray-400'>{hardSolved}/{totalHard}</span>
                  </div>
                  <div className='h-1.5 bg-dark-fill-3 rounded-full overflow-hidden'>
                    <div className='h-full bg-red-500' style={{ width: `${(hardSolved / (totalHard || 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Submissions & Achievements */}
          <div className='lg:col-span-3 space-y-8'>
            {/* Loyalty & XP */}
            <div className='bg-dark-layer-1 rounded-2xl p-8 border border-dark-fill-3'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold text-white flex items-center gap-2'>
                  <FaChartLine className='text-blue-400' /> Platform Level
                </h2>
                <span className='bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold'>
                  Level {level}
                </span>
              </div>
              <div className='space-y-4'>
                <div className='flex justify-between text-sm text-gray-400'>
                  <span>Level Progress</span>
                  <span>{progress}/100 XP</span>
                </div>
                <div className='h-4 bg-dark-fill-3 rounded-full overflow-hidden'>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className='h-full bg-gradient-to-r from-blue-500 to-purple-500'
                  />
                </div>
              </div>
            </div>

            {/* Badges Grid */}
            <div className='bg-dark-layer-1 rounded-2xl p-8 border border-dark-fill-3'>
              <h2 className='text-xl font-bold text-white mb-6 flex items-center gap-2'>
                <FaMedal className='text-yellow-500' /> Achievements
              </h2>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                {userBadges?.map((ub) => (
                  <div key={ub.id} className='flex flex-col items-center p-4 rounded-xl bg-dark-fill-3 border border-transparent hover:border-brand-orange transition group'>
                    <div className='text-4xl mb-2 group-hover:scale-110 transition'>{ub.badge?.image}</div>
                    <p className='text-white text-xs font-bold text-center'>{ub.badge?.name}</p>
                    <p className='text-[10px] text-gray-500 text-center mt-1'>{ub.badge?.description}</p>
                  </div>
                ))}
                {(!userBadges || userBadges.length === 0) && (
                  <div className='col-span-full py-6 text-center text-gray-500 italic'>
                    No badges earned yet. Solve problems to unlock!
                  </div>
                )}
              </div>
            </div>

            {/* Recent Submissions */}
            <div className='bg-dark-layer-1 rounded-2xl border border-dark-fill-3 overflow-hidden'>
              <div className='p-6 border-b border-dark-fill-3'>
                <h2 className='text-xl font-bold text-white'>Recent Submissions</h2>
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                  <thead className='bg-dark-layer-2 text-xs text-gray-400 uppercase'>
                    <tr>
                      <th className='px-6 py-4'>Problem</th>
                      <th className='px-6 py-4'>Status</th>
                      <th className='px-6 py-4'>Language</th>
                      <th className='px-6 py-4'>Time</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-dark-fill-3 text-sm'>
                    {submissions?.slice(0, 5).map((sub) => (
                      <tr key={sub.id} className='hover:bg-dark-fill-3 transition'>
                        <td className='px-6 py-4'>
                          <Link href={`/problems/${sub.problemSlug}`} className='text-blue-400 hover:underline'>
                            {sub.problemTitle}
                          </Link>
                        </td>
                        <td className='px-6 py-4'>
                          <span className={`${sub.status === 'Accepted' ? 'text-green-500' : 'text-red-500'} font-medium`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-gray-400'>{sub.language}</td>
                        <td className='px-6 py-4 text-gray-500'>
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {(!submissions || submissions.length === 0) && (
                      <tr>
                        <td colSpan={4} className='px-6 py-10 text-center text-gray-500 italic'>
                          No submissions yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
