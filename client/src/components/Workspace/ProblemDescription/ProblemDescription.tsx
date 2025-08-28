import CircleSkeleton from "@/components/Skeletons/CircleSkeleton";
import RectangleSkeleton from "@/components/Skeletons/RectangleSkeleton";
import { auth } from "@/lib/firebase";
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

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problemSlug, _solved }) => {
	const [user] = useAuthState(auth);
	
	// Get problem data
	const { data: problem, isLoading } = useQuery({
		queryKey: [`/api/problems/${problemSlug}`],
		enabled: !!problemSlug
	});

	const handleLike = async () => {
		if (!user) {
			toast.error("You must be logged in to like a problem", { position: "top-left", theme: "dark" });
			return;
		}
		// Like functionality would go here
		toast.success("Problem liked!", { position: "top-left", theme: "dark" });
	};

	const handleDislike = async () => {
		if (!user) {
			toast.error("You must be logged in to dislike a problem", { position: "top-left", theme: "dark" });
			return;
		}
		// Dislike functionality would go here
		toast.info("Problem disliked", { position: "top-left", theme: "dark" });
	};

	const handleStar = async () => {
		if (!user) {
			toast.error("You must be logged in to star a problem", { position: "top-left", theme: "dark" });
			return;
		}
		// Star functionality would go here
		toast.success("Problem starred!", { position: "top-left", theme: "dark" });
	};

	if (isLoading) {
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

	if (!problem) {
		return <div>Problem not found</div>;
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
							{_solved && (
								<div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
									<BsCheck2Circle />
								</div>
							)}
							<div
								className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'
								onClick={handleLike}
							>
								<AiFillLike />
								<span className='text-xs'>0</span>
							</div>
							<div
								className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6'
								onClick={handleDislike}
							>
								<AiFillDislike />
								<span className='text-xs'>0</span>
							</div>
							<div
								className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '
								onClick={handleStar}
							>
								<TiStarOutline />
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
export default ProblemDescription;