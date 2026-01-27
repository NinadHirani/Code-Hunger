import React from "react";
import Topbar from "@/components/Topbar";
import { useQuery } from "@tanstack/react-query";
import { Submission } from "@shared/schema";
import { Link } from "wouter";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle, Award, Target, Zap } from "lucide-react";

type SubmissionWithDetails = Submission & {
  problemTitle: string;
  problemSlug: string;
  attemptNumber: number;
};

const SubmissionsPage: React.FC = () => {
  const visitorId = localStorage.getItem("visitorId") || "anonymous";

  const { data: submissions, isLoading } = useQuery<SubmissionWithDetails[]>({
    queryKey: [`/api/users/${visitorId}/submissions-with-details`],
  });

  const getStats = (subs: SubmissionWithDetails[]) => {
    const solvedProblems = new Set(subs.filter(s => s.status === "Accepted").map(s => s.problemId));
    const totalTries = subs.length;
    
    // Find submissions that were correct and see which try they were
    const correctSubmissions = subs.filter(s => s.status === "Accepted");
    
    return {
      solvedCount: solvedProblems.size,
      totalTries,
      correctCount: correctSubmissions.length
    };
  };

  const stats = submissions ? getStats(submissions) : { solvedCount: 0, totalTries: 0, correctCount: 0 };

  return (
    <div className='bg-dark-layer-2 min-h-screen'>
      <Topbar />
      <main className='max-w-[1200px] mx-auto py-10 px-5'>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className='text-3xl font-bold text-white'>Submissions</h1>
            <p className="text-dark-gray-7 mt-1">Track your progress and review your solutions</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-dark-layer-1 border border-dark-fill-3 rounded-lg px-4 py-3 flex items-center gap-3">
              <div className="bg-olive/20 p-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-olive" />
              </div>
              <div>
                <p className="text-xs text-dark-gray-7 uppercase font-semibold">Solved</p>
                <p className="text-xl font-bold text-white">{stats.solvedCount}</p>
              </div>
            </div>
            
            <div className="bg-dark-layer-1 border border-dark-fill-3 rounded-lg px-4 py-3 flex items-center gap-3">
              <div className="bg-brand-orange/20 p-2 rounded-full">
                <Target className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <p className="text-xs text-dark-gray-7 uppercase font-semibold">Total Tries</p>
                <p className="text-xl font-bold text-white">{stats.totalTries}</p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <Loader2 className='w-10 h-10 text-brand-orange animate-spin' />
          </div>
        ) : !submissions || submissions.length === 0 ? (
          <div className='text-center py-20 bg-dark-layer-1 rounded-lg border border-dark-fill-3 shadow-xl'>
            <Award className="w-16 h-16 text-dark-gray-7 mx-auto mb-4 opacity-20" />
            <p className='text-dark-gray-7 text-lg'>No submissions yet. Start your coding journey today!</p>
            <Link href='/'>
              <button className='mt-6 bg-brand-orange text-white px-8 py-3 rounded-md font-semibold hover:bg-brand-orange-s transition-all shadow-lg hover:scale-105 active:scale-95'>
                View Problems
              </button>
            </Link>
          </div>
        ) : (
          <div className='overflow-hidden rounded-xl border border-dark-fill-3 bg-dark-layer-1 shadow-2xl'>
            <div className="overflow-x-auto">
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='bg-dark-fill-3/30 text-dark-gray-7 text-xs uppercase tracking-wider'>
                    <th className='px-6 py-4 font-bold'>Problem</th>
                    <th className='px-6 py-4 font-bold text-center'>Status</th>
                    <th className='px-6 py-4 font-bold text-center'>Score</th>
                    <th className='px-6 py-4 font-bold'>Language</th>
                    <th className='px-6 py-4 font-bold'>Try #</th>
                    <th className='px-6 py-4 font-bold'>Runtime</th>
                    <th className='px-6 py-4 font-bold text-right'>Date</th>
                  </tr>
                </thead>
                <tbody className='text-white text-sm divide-y divide-dark-fill-3'>
                  {submissions.map((submission) => (
                    <tr key={submission.id} className='hover:bg-dark-fill-3/50 transition-colors group'>
                      <td className='px-6 py-5'>
                        <Link href={`/problems/${submission.problemSlug}`} className='hover:text-brand-orange font-semibold transition-colors flex items-center gap-2'>
                          <Zap className="w-4 h-4 text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                          {submission.problemTitle}
                        </Link>
                      </td>
                      <td className='px-6 py-5'>
                        <div className="flex justify-center">
                          {submission.status === "Accepted" ? (
                            <span className="bg-olive/10 text-olive px-3 py-1 rounded-full text-xs font-bold border border-olive/20 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Accepted
                            </span>
                          ) : (
                            <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20 flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Wrong Answer
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <div className="flex flex-col items-center">
                          <span className="font-mono font-bold text-dark-gray-8">
                            {submission.passedCount !== null ? (
                                <span className={submission.passedCount === submission.totalCount ? "text-olive" : "text-dark-gray-7"}>
                                    {submission.passedCount}
                                </span>
                            ) : "0"}
                            <span className="text-dark-gray-6">/</span>
                            {submission.totalCount || "0"}
                          </span>
                          <div className="w-16 h-1 bg-dark-fill-3 rounded-full mt-1 overflow-hidden">
                            <div 
                              className={`h-full ${submission.status === "Accepted" ? "bg-olive" : "bg-red-500"}`} 
                              style={{ width: `${submission.totalCount ? (submission.passedCount || 0) / submission.totalCount * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <span className='text-dark-gray-7 capitalize font-medium px-2 py-1 bg-dark-fill-3 rounded text-xs'>
                          {submission.language}
                        </span>
                      </td>
                      <td className='px-6 py-5'>
                        <span className={`font-bold ${submission.status === "Accepted" ? "text-brand-orange" : "text-dark-gray-7"}`}>
                          Try {submission.attemptNumber}
                        </span>
                      </td>
                      <td className='px-6 py-5'>
                        <span className="text-dark-gray-7 font-mono text-xs">
                          {submission.runtime ? `${submission.runtime} ms` : "--"}
                        </span>
                      </td>
                      <td className='px-6 py-5 text-right text-dark-gray-7 text-xs font-medium'>
                        {submission.createdAt ? format(new Date(submission.createdAt), "MMM d, HH:mm") : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubmissionsPage;
