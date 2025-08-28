import { auth } from "@/lib/firebase";
import { Link } from "wouter";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import Timer from "./Timer/Timer";
import { useLocation } from "wouter";
import { FiLogOut } from "react-icons/fi";
import { signOutUser } from "@/lib/firebase";

type TopbarProps = {
	problemPage?: boolean;
};

const Topbar: React.FC<TopbarProps> = ({ problemPage }) => {
	const [user] = useAuthState(auth);
	const setAuthModalState = useSetRecoilState(authModalState);
	const [location, setLocation] = useLocation();

	const handleProblemChange = (isForward: boolean) => {
		// Simple navigation logic - would need to be enhanced with actual problem ordering
		if (isForward) {
			console.log("Navigate to next problem");
		} else {
			console.log("Navigate to previous problem");
		}
	};

	const handleLogout = () => {
		signOutUser();
	};

	return (
		<nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7'>
			<div className={`flex w-full items-center justify-between ${!problemPage ? "max-w-[1200px] mx-auto" : ""}`}>
				<Link href='/' className='h-[22px] flex-1'>
					<div className="text-white font-bold text-xl">LeetCode Clone</div>
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

				<div className='flex items-center space-x-4 flex-1 justify-end'>
					<div>
						<a
							href='https://github.com'
							target='_blank'
							rel='noreferrer'
							className='bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange hover:bg-dark-fill-2'
						>
							Premium
						</a>
					</div>
					{!user && (
						<button
							onClick={() => setAuthModalState((prev) => ({ ...prev, isOpen: true, type: "login" }))}
							className='bg-dark-fill-3 py-1 px-2 cursor-pointer rounded'
						>
							Sign In
						</button>
					)}
					{user && problemPage && <Timer />}
					{user && (
						<div className='cursor-pointer group relative'>
							<div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center text-white font-semibold">
								{user.email?.[0]?.toUpperCase()}
							</div>
							<div
								className='absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg 
								z-40 group-hover:scale-100 scale-0 
								transition-all duration-300 ease-in-out'
							>
								<p className='text-sm'>{user.email}</p>
							</div>
						</div>
					)}
					{user && (
						<button 
							className='bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange' 
							onClick={handleLogout}
						>
							<FiLogOut />
						</button>
					)}
				</div>
			</div>
		</nav>
	);
};
export default Topbar;