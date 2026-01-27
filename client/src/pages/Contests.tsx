import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Topbar from '@/components/Topbar';
import { Contest } from '@shared/schema';
import { Link } from 'wouter';
import { format } from 'date-fns';

const Contests = () => {
  const { data: contests, isLoading } = useQuery<Contest[]>({
    queryKey: ['/api/contests'],
  });

  return (
      <main className='bg-dark-layer-2 min-h-screen'>
        <Topbar />
        <div className='max-w-[1200px] mx-auto px-6 py-12'>
          <div className="mb-12 text-center md:text-left">
            <h1 className='text-4xl font-extrabold text-white mb-4 tracking-tight'>
              Coding <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-dark-yellow">Contests</span>
            </h1>
            <p className="text-dark-gray-7 text-lg max-w-2xl">
              Test your skills in real-time. Compete with others, climb the leaderboard, and prove your coding prowess.
            </p>
          </div>
          
          {isLoading ? (
          <div className='text-gray-400'>Loading contests...</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {contests?.map((contest) => (
              <div key={contest.id} className='bg-dark-layer-1 rounded-xl p-6 border border-dark-fill-3 hover:border-brand-orange transition group'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      contest.status === 'ongoing' ? 'bg-red-500/20 text-red-500' :
                      contest.status === 'upcoming' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-gray-500/20 text-gray-500'
                    }`}>
                      {contest.status}
                    </span>
                    <h2 className='text-xl font-bold text-white mt-2 group-hover:text-brand-orange transition'>{contest.title}</h2>
                  </div>
                  {contest.status === 'ongoing' && (
                    <div className='text-brand-orange animate-pulse font-mono font-bold'>
                      LIVE
                    </div>
                  )}
                </div>
                
                <p className='text-gray-400 mb-6 line-clamp-2'>{contest.description}</p>
                
                <div className='flex items-center justify-between text-sm'>
                  <div className='text-gray-500'>
                    <p>Start: {format(new Date(contest.startTime), 'MMM d, HH:mm')}</p>
                    <p>End: {format(new Date(contest.endTime), 'MMM d, HH:mm')}</p>
                  </div>
                  <Link href={`/contests/${contest.id}`}>
                    <button className='bg-brand-orange text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-orange-s transition'>
                      {contest.status === 'upcoming' ? 'Register' : 'Enter Contest'}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Contests;
