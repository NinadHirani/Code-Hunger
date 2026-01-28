import { Link, useLocation } from "wouter";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import Timer from "./Timer";
import { useQuery } from "@tanstack/react-query";

type TopbarProps = {
	problemPage?: boolean;
};

const Topbar: React.FC<TopbarProps> = ({ problemPage }) => {
	const [location, navigate] = useLocation();

        // Get all problems for navigation
        const { data: problems } = useQuery({
                queryKey: ['/api/problems']
        });

        const handleProblemChange = (isForward: boolean) => {
                if (!problems || !Array.isArray(problems)) return;
                
                // Get current problem slug from URL
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
		<nav className='relative flex h-[55px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7 border-b border-dark-divider-border-2 z-50'>
			<div className={`flex w-full items-center justify-between mx-auto ${!problemPage ? "max-w-7xl" : ""}`}>
				{/* Left Section: Logo & Main Nav */}
				<div className='flex items-center gap-8'>
					<Link href='/' className='flex items-center gap-2 group'>
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-dark-yellow text-2xl font-bold tracking-tight transition-all group-hover:opacity-80">
							Code-Hunger
						</span>
					</Link>
					
					{!problemPage && (
						<div className='hidden md:flex items-center gap-6'>
							<Link href='/' className={`hover:text-white transition-colors font-medium ${location === '/' || location.startsWith('/problems') ? 'text-brand-orange' : 'text-dark-gray-7'}`}>
								Problems
							</Link>
							<Link href='/contests' className={`hover:text-white transition-colors font-medium ${location === '/contests' ? 'text-brand-orange' : 'text-dark-gray-7'}`}>
								Contests
							</Link>
							<Link href='/learning-paths' className={`hover:text-white transition-colors font-medium relative ${location === '/learning-paths' ? 'text-brand-orange' : 'text-dark-gray-7'}`}>
								Paths
								<span className='absolute -top-2 -right-3 text-[7px] bg-brand-orange text-white px-1 py-0.5 rounded-full font-bold'>NEW</span>
							</Link>
							<Link href='/job-simulations' className={`hover:text-white transition-colors font-medium relative ${location === '/job-simulations' ? 'text-brand-orange' : 'text-dark-gray-7'}`}>
								Sims
								<span className='absolute -top-2 -right-3 text-[7px] bg-brand-orange text-white px-1 py-0.5 rounded-full font-bold'>NEW</span>
							</Link>
						</div>
					)}
				</div>

				{/* Center Section: Problem Navigation (only on problem page) */}
				{problemPage && (
					<div className='flex items-center gap-3 justify-center bg-dark-fill-3/50 rounded-lg p-1'>
						<div
							className='flex items-center justify-center rounded-md bg-dark-fill-3 hover:bg-dark-fill-2 h-7 w-7 cursor-pointer transition-colors'
							onClick={() => handleProblemChange(false)}
						>
							<FaChevronLeft className="text-xs" />
						</div>
						<Link
							href='/'
							className='flex items-center gap-2 font-medium px-2 py-1 text-dark-gray-8 cursor-pointer hover:bg-dark-fill-2 rounded-md transition-colors'
						>
							<BsList className="text-lg" />
							<p className="hidden md:block text-sm">Problem List</p>
						</Link>
						<div
							className='flex items-center justify-center rounded-md bg-dark-fill-3 hover:bg-dark-fill-2 h-7 w-7 cursor-pointer transition-colors'
							onClick={() => handleProblemChange(true)}
						>
							<FaChevronRight className="text-xs" />
						</div>
					</div>
				)}

				{/* Right Section: Actions/Profile */}
				<div className='flex items-center gap-4 justify-end'>
					{!problemPage && (
						<Link href='/submissions' className={`hidden lg:block hover:text-white transition-colors font-medium ${location === '/submissions' ? 'text-brand-orange' : 'text-dark-gray-7'}`}>
							Submissions
						</Link>
					)}
					
					{problemPage && <Timer />}
					
					<Link href='/profile'>
						<div className='flex items-center justify-center rounded-full bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer border-2 border-transparent hover:border-brand-orange transition-all overflow-hidden shadow-sm'>
							<div className='w-full h-full bg-gradient-to-tr from-brand-orange to-dark-yellow flex items-center justify-center text-white text-xs font-bold'>
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