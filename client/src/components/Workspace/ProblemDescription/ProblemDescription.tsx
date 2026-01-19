import CircleSkeleton from "@/components/Skeletons/CircleSkeleton";
import RectangleSkeleton from "@/components/Skeletons/RectangleSkeleton";
import { useEffect, useState } from "react";
import { AiFillLike, AiFillDislike, AiOutlineLoading3Quarters, AiFillStar } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type ProblemDescriptionProps = {
	problemSlug: string;
	_solved: boolean;
};

const getVisitorId = () => {
	let visitorId = localStorage.getItem("visitorId");
	if (!visitorId) {
		visitorId = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		localStorage.setItem("visitorId", visitorId);
	}
	return visitorId;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problemSlug, _solved }) => {
	const [updating, setUpdating] = useState(false);
	const queryClient = useQueryClient();
	const visitorId = getVisitorId();

	const { data: problem, isLoading } = useQuery({
		queryKey: [`/api/problems/${problemSlug}`],
		enabled: !!problemSlug
	});

	const { data: interaction, refetch: refetchInteraction } = useQuery({
		queryKey: [`/api/problems/${problemSlug}/interaction`, visitorId],
		queryFn: async () => {
			const res = await fetch(`/api/problems/${problemSlug}/interaction?visitorId=${visitorId}`);
			return res.json();
		},
		enabled: !!problemSlug
	});

	const likeMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/problems/${problemSlug}/like`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ visitorId })
			});
			return res.json();
		},
		onSuccess: () => {
			refetchInteraction();
		}
	});

	const dislikeMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/problems/${problemSlug}/dislike`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ visitorId })
			});
			return res.json();
		},
		onSuccess: () => {
			refetchInteraction();
		}
	});

	const starMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/problems/${problemSlug}/star`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ visitorId })
			});
			return res.json();
		},
		onSuccess: () => {
			refetchInteraction();
		}
	});

	const handleLike = async () => {
		if (updating) return;
		setUpdating(true);
		try {
			await likeMutation.mutateAsync();
			toast.success(interaction?.liked ? "Removed like" : "Problem liked!", { position: "top-left", theme: "dark" });
		} catch {
			toast.error("Failed to like", { position: "top-left", theme: "dark" });
		}
		setUpdating(false);
	};

	const handleDislike = async () => {
		if (updating) return;
		setUpdating(true);
		try {
			await dislikeMutation.mutateAsync();
			toast.info(interaction?.disliked ? "Removed dislike" : "Problem disliked", { position: "top-left", theme: "dark" });
		} catch {
			toast.error("Failed to dislike", { position: "top-left", theme: "dark" });
		}
		setUpdating(false);
	};

	const handleStar = async () => {
		if (updating) return;
		setUpdating(true);
		try {
			await starMutation.mutateAsync();
			toast.success(interaction?.starred ? "Removed from starred" : "Problem starred!", { position: "top-left", theme: "dark" });
		} catch {
			toast.error("Failed to star", { position: "top-left", theme: "dark" });
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

	const liked = interaction?.liked || false;
	const disliked = interaction?.disliked || false;
	const starred = interaction?.starred || false;
	const solved = interaction?.solved || false;
	const likes = interaction?.likes || 0;
	const dislikes = interaction?.dislikes || 0;

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
								<span className='text-xs'>{likes}</span>
							</div>
							<div
								className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6'
								onClick={handleDislike}
							>
								{disliked && !updating && <AiFillDislike className='text-dark-blue-s' />}
								{!disliked && !updating && <AiFillDislike />}
								{updating && <AiOutlineLoading3Quarters className='animate-spin' />}
								<span className='text-xs'>{dislikes}</span>
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

						<div className='text-white text-sm mt-6'>
							<div dangerouslySetInnerHTML={{ __html: problem.description }} />
						</div>

						<div className='mt-4'>
							{problem.examples && problem.examples.map((example: any, index: number) => (
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
