import { useState, useEffect, useRef } from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineSetting } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { ISettings } from "../Playground";
import SettingsModal from "@/components/Modals/SettingsModal";

export type Language = "javascript" | "python" | "java" | "cpp";

const LANGUAGES: { id: Language; name: string; icon: string }[] = [
	{ id: "javascript", name: "JavaScript", icon: "JS" },
	{ id: "python", name: "Python", icon: "PY" },
	{ id: "java", name: "Java", icon: "JV" },
	{ id: "cpp", name: "C++", icon: "C++" },
];

type PreferenceNavProps = {
	settings: ISettings;
	setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
	selectedLanguage: Language;
	onLanguageChange: (language: Language) => void;
};

const PreferenceNav: React.FC<PreferenceNavProps> = ({ setSettings, settings, selectedLanguage, onLanguageChange }) => {
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleFullScreen = () => {
		if (isFullScreen) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		}
		setIsFullScreen(!isFullScreen);
	};

	useEffect(() => {
		function exitHandler() {
			if (!document.fullscreenElement) {
				setIsFullScreen(false);
				return;
			}
			setIsFullScreen(true);
		}

		if (document.addEventListener) {
			document.addEventListener("fullscreenchange", exitHandler);
			document.addEventListener("webkitfullscreenchange", exitHandler);
			document.addEventListener("mozfullscreenchange", exitHandler);
			document.addEventListener("MSFullscreenChange", exitHandler);
		}

		return () => {
			document.removeEventListener("fullscreenchange", exitHandler);
			document.removeEventListener("webkitfullscreenchange", exitHandler);
			document.removeEventListener("mozfullscreenchange", exitHandler);
			document.removeEventListener("MSFullscreenChange", exitHandler);
		};
	}, [isFullScreen]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const currentLanguage = LANGUAGES.find(l => l.id === selectedLanguage) || LANGUAGES[0];

	return (
		<div className='flex items-center justify-between bg-dark-layer-2 h-11 w-full '>
			<div className='flex items-center text-white relative' ref={dropdownRef}>
				<button 
					className='flex cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2 px-2 py-1.5 font-medium'
					onClick={() => setDropdownOpen(!dropdownOpen)}
				>
					<div className='flex items-center px-1 gap-2'>
						<div className='text-xs text-label-2 dark:text-dark-label-2'>{currentLanguage.name}</div>
						<BsChevronDown className={`text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
					</div>
				</button>

				{dropdownOpen && (
					<div className='absolute top-full left-0 mt-1 bg-dark-layer-1 border border-dark-fill-3 rounded-md shadow-lg z-50 min-w-[140px]'>
						{LANGUAGES.map((lang) => (
							<button
								key={lang.id}
								className={`w-full text-left px-3 py-2 text-sm hover:bg-dark-fill-3 flex items-center gap-2 ${
									selectedLanguage === lang.id ? 'bg-dark-fill-2 text-brand-orange' : 'text-dark-label-2'
								}`}
								onClick={() => {
									onLanguageChange(lang.id);
									setDropdownOpen(false);
								}}
							>
								<span className='w-6 text-xs font-mono'>{lang.icon}</span>
								<span>{lang.name}</span>
							</button>
						))}
					</div>
				)}
			</div>

			<div className='flex items-center m-2'>
				<button
					className='preferenceBtn group'
					onClick={() => setSettings({ ...settings, settingsModalIsOpen: true })}
				>
					<div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
						<AiOutlineSetting />
					</div>
					<div className='preferenceBtn-tooltip'>Settings</div>
				</button>

				<button className='preferenceBtn group' onClick={handleFullScreen}>
					<div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
						{!isFullScreen ? <AiOutlineFullscreen /> : <AiOutlineFullscreenExit />}
					</div>
					<div className='preferenceBtn-tooltip'>Full Screen</div>
				</button>
			</div>
			{settings.settingsModalIsOpen && <SettingsModal settings={settings} setSettings={setSettings} />}
		</div>
	);
};
export default PreferenceNav;
