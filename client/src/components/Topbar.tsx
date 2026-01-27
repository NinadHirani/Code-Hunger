import { Link, useLocation } from "wouter";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import Timer from "./Timer/Timer";
import { useQuery } from "@tanstack/react-query";

type TopbarProps = {
	problemPage?: boolean;
};

const Topbar: React.FC<TopbarProps> = ({ problemPage }) => {
	const [location, navigate] = useLocation();

	const { data: problems } = useQuery({
		queryKey: ['/api/problems']
	});

	const handleProblemChange = (isForward: boolean) => {
		if (!problems || !Array.isArray(problems)) return;
		
		const currentSlug = location.split('/')[2];
		const currentIndex = problems.findIndex(p => p.slug === currentSlug);
		
		if (currentIndex === -1) return;
		
		let nextIndex;
		if (isForward) {
			nextIndex = currentIndex + 1 >= problems.length ? 0 : currentIndex + 1;
		} else {
			nextIndex = currentIndex - 1 < 0 ? problems.length - 1 : currentIndex - 1;
		}
		
		navigate(`/problems/${problems[nextIndex].slug}`);
	};

	return (
		<nav className='relative flex h-[60px] w-full shrink-0 items-center px-6 bg-dark-layer-1/95 backdrop-blur-md text-dark-gray-7 border-b border-dark-divider-border-2/50'>
			<div className={`flex w-full items-center justify-between ${!problemPage ? "max-w-[1200px] mx-auto" : ""}`}>
				<Link href='/' className='flex items-center gap-3 flex-1'>
					<div className="w-9 h-9 bg-gradient-to-br from-brand-orange to-dark-yellow rounded-lg flex items-center justify-center shadow-lg shadow-brand-orange/20">
						<span className="text-white font-bold text-lg">CH</span>
					</div>
					<div className="text-white text-xl font-bold tracking-tight">Code <span className="text-brand-orange">Hunger</span></div>
				</Link>

				{problemPage && (
					<div className='flex items-center gap-4 flex-1 justify-center'>
						<div
							className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer'
							onClick={() => handleProblemChange(false)}
						>
							<FaChevronLeft />
						</div>
						<Link
							href='/'
							className='flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer'
						>
							<div>
								<BsList />
							</div>
							<p>Problem List</p>
						</Link>
						<div
							className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer'
							onClick={() => handleProblemChange(true)}
						>
							<FaChevronRight />
						</div>
					</div>
				)}

				<div className='flex items-center space-x-6 flex-1 justify-end'>
					<Link href='/' className={`hover:text-white transition font-medium ${location === '/' || location === '/search' || (location.startsWith('/problems') && !problemPage) ? 'text-brand-orange' : 'text-dark-gray-7'}`}>
						Problems
					</Link>
					<Link href='/contests' className={`hover:text-white transition font-medium ${location === '/contests' ? 'text-brand-orange' : 'text-dark-gray-7'}`}>
						Contests
					</Link>
					<Link href='/submissions' className={`hover:text-white transition font-medium ${location === '/submissions' ? 'text-brand-orange' : 'text-dark-gray-7'}`}>
						Submissions
					</Link>
					{problemPage && <Timer />}
					<Link href='/profile'>
						<div className='flex items-center justify-center rounded-full bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer border border-transparent hover:border-brand-orange transition-all overflow-hidden'>
							<div className='w-full h-full bg-gradient-to-tr from-brand-orange to-yellow-500 flex items-center justify-center text-white text-sm font-bold'>
								{(localStorage.getItem('visitorId') || 'A').charAt(0).toUpperCase()}
							</div>
						</div>
					</Link>
				</div>
			</div>
		</nav>
	);
};
export default Topbar;