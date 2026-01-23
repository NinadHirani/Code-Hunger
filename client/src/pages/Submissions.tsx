import React from "react";
import Topbar from "@/components/Topbar/Topbar";
import { useQuery } from "@tanstack/react-query";
import { Submission } from "@shared/schema";
import { Link } from "wouter";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

type SubmissionWithDetails = Submission & {
  problemTitle: string;
  problemSlug: string;
};

const SubmissionsPage: React.FC = () => {
  const visitorId = localStorage.getItem("visitorId") || "anonymous";

  const { data: submissions, isLoading } = useQuery<SubmissionWithDetails[]>({
    queryKey: [`/api/users/${visitorId}/submissions-with-details`],
  });

  const calculateTries = (allSubmissions: SubmissionWithDetails[], currentProblemId: string, currentSubmissionId: string) => {
    const problemSubmissions = allSubmissions
      .filter((s) => s.problemId === currentProblemId)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());

    const acceptedIndex = problemSubmissions.findIndex((s) => s.status === "Accepted");
    const currentSubmissionIndex = problemSubmissions.findIndex((s) => s.id === currentSubmissionId);

    if (acceptedIndex === -1) {
      return `Try ${currentSubmissionIndex + 1}`;
    }

    if (currentSubmissionIndex === acceptedIndex) {
        return `Correct! (Try ${currentSubmissionIndex + 1})`;
    }

    return `Try ${currentSubmissionIndex + 1}`;
  };

  const getProblemStats = (allSubmissions: SubmissionWithDetails[]) => {
    const stats: Record<string, { triesToSolve: number | null; totalTries: number }> = {};
    
    allSubmissions.forEach(s => {
        if (!stats[s.problemId]) {
            stats[s.problemId] = { triesToSolve: null, totalTries: 0 };
        }
        stats[s.problemId].totalTries++;
    });

    // Sort by date to find first accepted
    const sorted = [...allSubmissions].sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
    
    const firstAccepted: Record<string, number> = {};
    const problemTries: Record<string, number> = {};

    sorted.forEach(s => {
        if (firstAccepted[s.problemId] !== undefined) return;
        
        problemTries[s.problemId] = (problemTries[s.problemId] || 0) + 1;
        
        if (s.status === "Accepted") {
            firstAccepted[s.problemId] = problemTries[s.problemId];
        }
    });

    Object.keys(firstAccepted).forEach(pid => {
        if (stats[pid]) {
            stats[pid].triesToSolve = firstAccepted[pid];
        }
    });

    return stats;
  };

  const problemStats = submissions ? getProblemStats(submissions) : {};

  return (
    <div className='bg-dark-layer-2 min-h-screen'>
      <Topbar />
      <main className='max-w-[1200px] mx-auto py-10 px-5'>
        <h1 className='text-2xl font-bold text-white mb-8'>My Submissions</h1>

        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <Loader2 className='w-10 h-10 text-brand-orange animate-spin' />
          </div>
        ) : !submissions || submissions.length === 0 ? (
          <div className='text-center py-20 bg-dark-layer-1 rounded-lg border border-dark-fill-3'>
            <p className='text-dark-gray-7 text-lg'>No submissions yet. Go solve some problems!</p>
            <Link href='/'>
              <button className='mt-4 bg-brand-orange text-white px-6 py-2 rounded-md hover:bg-brand-orange-s transition'>
                View Problems
              </button>
            </Link>
          </div>
        ) : (
          <div className='overflow-x-auto rounded-lg border border-dark-fill-3 bg-dark-layer-1'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='border-b border-dark-fill-3 text-dark-gray-7 text-sm'>
                  <th className='px-6 py-4 font-medium'>Problem</th>
                  <th className='px-6 py-4 font-medium'>Status</th>
                  <th className='px-6 py-4 font-medium'>Language</th>
                  <th className='px-6 py-4 font-medium'>Runtime</th>
                  <th className='px-6 py-4 font-medium'>Memory</th>
                  <th className='px-6 py-4 font-medium'>Attempt</th>
                  <th className='px-6 py-4 font-medium'>Date</th>
                </tr>
              </thead>
              <tbody className='text-white text-sm'>
                {submissions.map((submission) => (
                  <tr key={submission.id} className='border-b border-dark-fill-3 hover:bg-dark-fill-3 transition'>
                    <td className='px-6 py-4'>
                      <Link href={`/problems/${submission.problemSlug}`} className='hover:text-brand-orange font-medium'>
                        {submission.problemTitle}
                      </Link>
                    </td>
                    <td className='px-6 py-4'>
                      <span className={`${submission.status === "Accepted" ? "text-olive" : "text-red-500"} font-medium`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-dark-gray-7 capitalize'>{submission.language}</td>
                    <td className='px-6 py-4 text-dark-gray-7'>{submission.runtime ? `${submission.runtime} ms` : "N/A"}</td>
                    <td className='px-6 py-4 text-dark-gray-7'>{submission.memory ? `${submission.memory} MB` : "N/A"}</td>
                    <td className='px-6 py-4'>
                        <span className="text-dark-gray-7">
                            {calculateTries(submissions, submission.problemId, submission.id)}
                        </span>
                    </td>
                    <td className='px-6 py-4 text-dark-gray-7'>
                      {submission.createdAt ? format(new Date(submission.createdAt), "MMM d, yyyy HH:mm") : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubmissionsPage;
