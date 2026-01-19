import CircleSkeleton from "@/components/Skeletons/CircleSkeleton";
import RectangleSkeleton from "@/components/Skeletons/RectangleSkeleton";
import { useEffect, useState } from "react";
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
	const [updating, setUpdating] = useState(false);
        
        // Get problem data
        const { data: problem, isLoading } = useQuery({
                queryKey: [`/api/problems/${problemSlug}`],
                enabled: !!problemSlug
        });

        const { liked, disliked, starred, solved, setData } = useGetUsersDataOnProblem(problemSlug);
        const { currentProblem, loading, problemDifficultyClass, setCurrentProblem } = useGetCurrentProblem(problemSlug);

	const handleLike = async () => {
		if (updating) return;
		setUpdating(true);

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
		if (updating) return;
		setUpdating(true);

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
		if (updating) return;
		setUpdating(true);

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
				return "bg-[rgba(0,184,175,0.15)] text-[#00b8af]";
			case "Medium":
				return "bg-[rgba(255,192,30,0.15)] text-[#ffc01e]";
			case "Hard":
				return "bg-[rgba(255,55,95,0.15)] text-[#ff375f]";
			default:
				return "bg-[rgba(255,192,30,0.15)] text-[#ffc01e]";
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
								className={`${getDifficultyColor(problem.difficulty)} inline-block rounded-[21px] px-2.5 py-1 text-xs font-medium capitalize `}
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
					? "bg-[rgba(0,184,175,0.15)] text-[#00b8af]"
					: problem.difficulty === "Medium"
					? "bg-[rgba(255,192,30,0.15)] text-[#ffc01e]"
					: "bg-[rgba(255,55,95,0.15)] text-[#ff375f]"
			);
                        setLoading(false);
                }
        }, [problem, problemSlug]);

        return { currentProblem, loading, problemDifficultyClass, setCurrentProblem };
}

function useGetUsersDataOnProblem(problemSlug: string) {
	const [data, setData] = useState({ liked: false, disliked: false, starred: false, solved: false });

	useEffect(() => {
		const stored = localStorage.getItem(`problem-data-${problemSlug}`);
		if (stored) {
			setData(JSON.parse(stored));
		}
	}, [problemSlug]);

	const setDataWithStorage = (updater: (prev: typeof data) => typeof data) => {
		setData((prev) => {
			const newData = updater(prev);
			localStorage.setItem(`problem-data-${problemSlug}`, JSON.stringify(newData));
			return newData;
		});
	};

	return { ...data, setData: setDataWithStorage };
}

export default ProblemDescription;