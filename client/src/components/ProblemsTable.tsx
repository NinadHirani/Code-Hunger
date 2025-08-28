import { Link } from "wouter";
import React, { useEffect, useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { AiFillYoutube } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import type { Problem } from "@shared/schema";

type ProblemsTableProps = {};

const ProblemsTable: React.FC<ProblemsTableProps> = () => {
        const [youtubePlayer, setYoutubePlayer] = useState({
                isOpen: false,
                videoId: "",
        });
        
        const [user] = useAuthState(auth);
        
        // Get problems from API
        const { data: problems = [], isLoading } = useQuery<Problem[]>({
                queryKey: ['/api/problems']
        });
        
        
        const closeModal = () => {
                setYoutubePlayer({ isOpen: false, videoId: "" });
        };

        useEffect(() => {
                const handleEsc = (e: KeyboardEvent) => {
                        if (e.key === "Escape") closeModal();
                };
                window.addEventListener("keydown", handleEsc);

                return () => window.removeEventListener("keydown", handleEsc);
        }, []);

        const getDifficultyColor = (difficulty: string) => {
                switch (difficulty) {
                        case "Easy":
                                return "text-dark-green-s";
                        case "Medium":
                                return "text-dark-yellow";
                        case "Hard":
                                return "text-dark-pink";
                        default:
                                return "text-dark-yellow";
                }
        };

        return (
                <>
                        <div className="bg-dark-layer-1 rounded-lg border border-dark-divider-border-2">
                                <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-dark-label-2 uppercase bg-dark-fill-3 border-b border-dark-divider-border-2">
                                                        <tr>
                                                                <th scope="col" className="px-1 py-3 w-0 font-medium">Status</th>
                                                                <th scope="col" className="px-6 py-3 font-medium">Title</th>
                                                                <th scope="col" className="px-6 py-3 font-medium">Difficulty</th>
                                                                <th scope="col" className="px-6 py-3 font-medium">Category</th>
                                                                <th scope="col" className="px-6 py-3 font-medium">Solution</th>
                                                        </tr>
                                                </thead>
                                                <tbody className='text-white'>
                                                        {problems.filter(problem => problem.title !== "Two Sum").map((problem: Problem, idx: number) => (
                                                                <tr 
                                                                        className={`${idx % 2 === 1 ? "bg-dark-layer-1" : ""} border-b border-dark-divider-border-2 hover:bg-dark-fill-2 transition-colors`} 
                                                                        key={problem.slug}
                                                                >
                                                                        <th className='px-2 py-4 font-medium whitespace-nowrap text-dark-green-s'>
                                                                                {/* Status indicator - would show checkmark if solved */}
                                                                        </th>
                                                                        <td className='px-6 py-4'>
                                                                                <Link
                                                                                        href={`/problems/${problem.slug}`}
                                                                                        className='hover:text-blue-600 cursor-pointer font-medium'
                                                                                >
                                                                                        {problem.title}
                                                                                </Link>
                                                                        </td>
                                                                        <td className={`px-6 py-4 ${getDifficultyColor(problem.difficulty)}`}>
                                                                                {problem.difficulty}
                                                                        </td>
                                                                        <td className="px-6 py-4 text-dark-gray-7">
                                                                                {problem.topics?.[0] || "Algorithm"}
                                                                        </td>
                                                                        <td className={"px-6 py-4"}>
                                                                                <p className='text-gray-400'>Coming soon</p>
                                                                        </td>
                                                                </tr>
                                                        ))}
                                                </tbody>
                                        </table>
                                </div>
                        </div>
                        
                        {youtubePlayer.isOpen && (
                                <div className='fixed top-0 left-0 h-screen w-screen flex items-center justify-center z-50'>
                                        <div
                                                className='bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute'
                                                onClick={closeModal}
                                        ></div>
                                        <div className='w-full z-50 h-full px-6 relative max-w-4xl'>
                                                <div className='w-full h-full flex items-center justify-center relative'>
                                                        <div className='w-full relative'>
                                                                <IoClose
                                                                        fontSize={"35"}
                                                                        className='cursor-pointer absolute -top-16 right-0 text-white'
                                                                        onClick={closeModal}
                                                                />
                                                                <div className="bg-white p-4 rounded-lg">
                                                                        <p>YouTube player would be here</p>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        )}
                </>
        );
};

export default ProblemsTable;