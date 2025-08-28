import CircleSkeleton from "@/components/Skeletons/CircleSkeleton";
import RectangleSkeleton from "@/components/Skeletons/RectangleSkeleton";
import { auth, firestore } from "@/lib/firebase";
import { arrayRemove, arrayUnion, doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiFillLike, AiFillDislike, AiOutlineLoading3Quarters, AiFillStar } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

type ProblemDescriptionProps = {
        problemSlug: string;
        _solved: boolean;
};

interface DBProblem {
        id: string;
        title: string;
        difficulty: string;
        likes: number;
        dislikes: number;
        description: string;
        examples: any[];
        constraints: string;
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problemSlug, _solved }) => {
        const [user] = useAuthState(auth);
        const [updating, setUpdating] = useState(false);
        
        // Get problem data
        const { data: problem, isLoading } = useQuery({
                queryKey: [`/api/problems/${problemSlug}`],
                enabled: !!problemSlug
        });

        const { liked, disliked, starred, solved, setData } = useGetUsersDataOnProblem(problemSlug);
        const { currentProblem, loading, problemDifficultyClass, setCurrentProblem } = useGetCurrentProblem(problemSlug);

        const returnUserDataAndProblemData = async (transaction: any) => {
                const userRef = doc(firestore, "users", user!.uid);
                const problemRef = doc(firestore, "problems", problemSlug);
                const userDoc = await transaction.get(userRef);
                const problemDoc = await transaction.get(problemRef);
                return { userDoc, problemDoc, userRef, problemRef };
        };

        const handleLike = async () => {
                if (!user) {
                        toast.error("You must be logged in to like a problem", { position: "top-left", theme: "dark" });
                        return;
                }
                if (updating) return;
                setUpdating(true);

                // For now, just show success message - full Firebase integration would go here
                if (liked) {
                        toast.info("Removed like", { position: "top-left", theme: "dark" });
                        setData((prev) => ({ ...prev, liked: false }));
                } else {
                        toast.success("Problem liked!", { position: "top-left", theme: "dark" });
                        setData((prev) => ({ ...prev, liked: true, disliked: false }));
                }
                setUpdating(false);
        };

        const handleDislike = async () => {
                if (!user) {
                        toast.error("You must be logged in to dislike a problem", { position: "top-left", theme: "dark" });
                        return;
                }
                if (updating) return;
                setUpdating(true);

                // For now, just show success message - full Firebase integration would go here
                if (disliked) {
                        toast.info("Removed dislike", { position: "top-left", theme: "dark" });
                        setData((prev) => ({ ...prev, disliked: false }));
                } else {
                        toast.info("Problem disliked", { position: "top-left", theme: "dark" });
                        setData((prev) => ({ ...prev, disliked: true, liked: false }));
                }
                setUpdating(false);
        };

        const handleStar = async () => {
                if (!user) {
                        toast.error("You must be logged in to star a problem", { position: "top-left", theme: "dark" });
                        return;
                }
                if (updating) return;
                setUpdating(true);

                // For now, just show success message - full Firebase integration would go here
                if (starred) {
                        toast.info("Removed from starred", { position: "top-left", theme: "dark" });
                        setData((prev) => ({ ...prev, starred: false }));
                } else {
                        toast.success("Problem starred!", { position: "top-left", theme: "dark" });
                        setData((prev) => ({ ...prev, starred: true }));
                }
                setUpdating(false);
        };

        if (isLoading || !problem) {
                return (
                        <div className='bg-dark-layer-1'>
                                <div className='flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden'>
                                        <div className={"bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
                                                Description
                                        </div>
                                </div>
                                <div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
                                        <div className='px-5'>
                                                <div className='w-full'>
                                                        <div className='flex space-x-4'>
                                                                <div className='flex-1 mr-2 text-lg text-white font-medium'>Loading...</div>
                                                        </div>
                                                        <div className='mt-3 flex space-x-2'>
                                                                <RectangleSkeleton />
                                                                <CircleSkeleton />
                                                                <RectangleSkeleton />
                                                                <RectangleSkeleton />
                                                                <CircleSkeleton />
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                );
        }

        const getDifficultyColor = (difficulty: string) => {
                switch (difficulty) {
                        case "Easy":
                                return "bg-olive text-olive";
                        case "Medium":
                                return "bg-dark-yellow text-dark-yellow";
                        case "Hard":
                                return "bg-dark-pink text-dark-pink";
                        default:
                                return "bg-dark-yellow text-dark-yellow";
                }
        };

        return (
                <div className='bg-dark-layer-1'>
                        {/* TAB */}
                        <div className='flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden'>
                                <div className={"bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
                                        Description
                                </div>
                        </div>

                        <div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
                                <div className='px-5'>
                                        {/* Problem heading */}
                                        <div className='w-full'>
                                                <div className='flex space-x-4'>
                                                        <div className='flex-1 mr-2 text-lg text-white font-medium'>{problem?.title}</div>
                                                </div>
                                                <div className='flex items-center mt-3'>
                                                        <div
                                                                className={`${getDifficultyColor(problem.difficulty)} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
                                                        >
                                                                {problem.difficulty}
                                                        </div>
                                                        {(solved || _solved) && (
                                                                <div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
                                                                        <BsCheck2Circle />
                                                                </div>
                                                        )}
                                                        <div
                                                                className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'
                                                                onClick={handleLike}
                                                        >
                                                                {liked && !updating && <AiFillLike className='text-dark-blue-s' />}
                                                                {!liked && !updating && <AiFillLike />}
                                                                {updating && <AiOutlineLoading3Quarters className='animate-spin' />}
                                                                <span className='text-xs'>0</span>
                                                        </div>
                                                        <div
                                                                className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6'
                                                                onClick={handleDislike}
                                                        >
                                                                {disliked && !updating && <AiFillDislike className='text-dark-blue-s' />}
                                                                {!disliked && !updating && <AiFillDislike />}
                                                                {updating && <AiOutlineLoading3Quarters className='animate-spin' />}
                                                                <span className='text-xs'>0</span>
                                                        </div>
                                                        <div
                                                                className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '
                                                                onClick={handleStar}
                                                        >
                                                                {starred && !updating && <AiFillStar className='text-dark-yellow' />}
                                                                {!starred && !updating && <TiStarOutline />}
                                                                {updating && <AiOutlineLoading3Quarters className='animate-spin' />}
                                                        </div>
                                                </div>

                                                {/* Problem Statement(paragraphs) */}
                                                <div className='text-white text-sm mt-6'>
                                                        <div dangerouslySetInnerHTML={{ __html: problem.description }} />
                                                </div>

                                                {/* Examples */}
                                                <div className='mt-4'>
                                                        {problem.examples && problem.examples.map((example, index) => (
                                                                <div key={index}>
                                                                        <p className='font-medium text-white '>Example {index + 1}: </p>
                                                                        <div className='example-card'>
                                                                                <pre>
                                                                                        <strong className='text-white'>Input: </strong> {example.input}
                                                                                        <br />
                                                                                        <strong>Output:</strong>
                                                                                        {example.output} <br />
                                                                                        {example.explanation && (
                                                                                                <>
                                                                                                        <strong>Explanation:</strong> {example.explanation}
                                                                                                </>
                                                                                        )}
                                                                                </pre>
                                                                        </div>
                                                                </div>
                                                        ))}
                                                </div>

                                                {/* Constraints */}
                                                <div className='my-8 pb-4'>
                                                        <div className='text-white text-sm font-medium'>Constraints:</div>
                                                        <ul className='text-white ml-5 list-disc '>
                                                                <div dangerouslySetInnerHTML={{ __html: problem.constraints }} />
                                                        </ul>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        );
};

function useGetCurrentProblem(problemSlug: string) {
        const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
        const [loading, setLoading] = useState<boolean>(true);
        const [problemDifficultyClass, setProblemDifficultyClass] = useState<string>("");

        // For now, we'll use the API data - in a full Firebase setup, this would query Firestore
        const { data: problem } = useQuery({
                queryKey: [`/api/problems/${problemSlug}`],
                enabled: !!problemSlug
        });

        useEffect(() => {
                if (problem) {
                        setCurrentProblem({
                                id: problemSlug,
                                title: problem.title,
                                difficulty: problem.difficulty,
                                likes: 0,
                                dislikes: 0,
                                description: problem.description,
                                examples: problem.examples || [],
                                constraints: problem.constraints
                        });
                        setProblemDifficultyClass(
                                problem.difficulty === "Easy"
                                        ? "bg-olive text-olive"
                                        : problem.difficulty === "Medium"
                                        ? "bg-dark-yellow text-dark-yellow"
                                        : " bg-dark-pink text-dark-pink"
                        );
                        setLoading(false);
                }
        }, [problem, problemSlug]);

        return { currentProblem, loading, problemDifficultyClass, setCurrentProblem };
}

function useGetUsersDataOnProblem(problemSlug: string) {
        const [data, setData] = useState({ liked: false, disliked: false, starred: false, solved: false });
        const [user] = useAuthState(auth);

        // For now, we'll just return default state - in a full Firebase setup, this would query user data
        useEffect(() => {
                if (user) {
                        // This would fetch user's interaction data with the problem from Firestore
                        setData({
                                liked: false,
                                disliked: false,
                                starred: false,
                                solved: false,
                        });
                } else {
                        setData({ liked: false, disliked: false, starred: false, solved: false });
                }
        }, [problemSlug, user]);

        return { ...data, setData };
}

export default ProblemDescription;