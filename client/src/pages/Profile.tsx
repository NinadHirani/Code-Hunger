import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Topbar from '@/components/Topbar/Topbar';
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

  const level = Math.floor((rewards?.points || 0) / 100) + 1;
  const progress = (rewards?.points || 0) % 100;

  return (
    <main className='bg-dark-layer-2 min-h-screen pb-10'>
      <Topbar />
      <div className='max-w-[1000px] mx-auto px-6 py-10'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          
          {/* Stats Section */}
          <div className='md:col-span-2 space-y-8'>
            <div className='bg-dark-layer-1 rounded-2xl p-8 border border-dark-fill-3'>
              <div className='flex items-center gap-6'>
                <div className='w-24 h-24 rounded-full bg-gradient-to-tr from-brand-orange to-yellow-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg'>
                  {visitorId.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-white mb-1'>User {visitorId.substring(0, 8)}</h1>
                  <p className='text-gray-400'>Coding Enthusiast</p>
                  <div className='mt-4 flex gap-4'>
                    <div className='flex items-center gap-2 text-brand-orange'>
                      <FaFire />
                      <span className='font-bold'>{streak?.currentStreak || 0} Day Streak</span>
                    </div>
                    <div className='flex items-center gap-2 text-yellow-500'>
                      <FaCoins />
                      <span className='font-bold'>{rewards?.points || 0} Points</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gamified Rewards */}
            <div className='bg-dark-layer-1 rounded-2xl p-8 border border-dark-fill-3'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold text-white flex items-center gap-2'>
                  <FaChartLine className='text-blue-400' /> Loyalty Level
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
                <p className='text-xs text-gray-500 text-center italic'>
                  Earn 10 points for every problem solved to level up!
                </p>
              </div>
            </div>

            {/* Badges Grid */}
            <div className='bg-dark-layer-1 rounded-2xl p-8 border border-dark-fill-3'>
              <h2 className='text-xl font-bold text-white mb-6 flex items-center gap-2'>
                <FaMedal className='text-yellow-500' /> Achievements & Badges
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
                  <div className='col-span-full py-10 text-center text-gray-500 italic'>
                    No badges earned yet. Start solving problems to unlock!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className='space-y-6'>
            <div className='bg-dark-layer-1 rounded-2xl p-6 border border-dark-fill-3'>
              <h3 className='text-white font-bold mb-4'>Streak Progress</h3>
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-400 text-sm'>Longest Streak</span>
                  <span className='text-white font-bold'>{streak?.longestStreak || 0} days</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-400 text-sm'>Total Problems</span>
                  <span className='text-white font-bold'>{(rewards?.points || 0) / 10}</span>
                </div>
              </div>
            </div>

            <div className='bg-gradient-to-br from-brand-orange to-orange-600 rounded-2xl p-6 text-white'>
              <h3 className='font-bold text-xl mb-2'>Premium Rewards</h3>
              <p className='text-sm opacity-90 mb-4'>Unlock exclusive contests and personalized feedback with Premium.</p>
              <button className='w-full bg-white text-brand-orange font-bold py-2 rounded-lg hover:bg-gray-100 transition'>
                Upgrade Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Profile;
