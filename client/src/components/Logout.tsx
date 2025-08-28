import { auth } from "@/lib/firebase";
import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { FiLogOut } from "react-icons/fi";

const Logout: React.FC = () => {
	const [signOut, loading, error] = useSignOut(auth);

	const handleLogout = () => {
		signOut();
	};
	
	return (
		<button 
			className='bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange hover:bg-dark-fill-2 transition-colors' 
			onClick={handleLogout}
			data-testid="button-logout"
		>
			<FiLogOut />
		</button>
	);
};

export default Logout;