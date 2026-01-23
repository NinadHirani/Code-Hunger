import { useState, useEffect, useMemo } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import { Language } from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import EditorFooter from "./EditorFooter";
import { toast } from "react-toastify";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useQuery } from "@tanstack/react-query";

type PlaygroundProps = {
	problemSlug: string;
	setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
	setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings {
	fontSize: string;
	settingsModalIsOpen: boolean;
	dropdownIsOpen: boolean;
}

interface TestResult {
	testCase: number;
	passed: boolean;
	input: string;
	expected: string;
	actual: string;
	error?: string;
}

interface ConsoleOutput {
	type: "info" | "success" | "error" | "result";
	message: string;
}

interface Problem {
	id: string;
	title: string;
	slug: string;
	difficulty: string;
	description: string;
	examples: { input: string; output: string; explanation?: string }[];
	constraints: string[];
	topics: string[];
	starterCode: Record<string, string>;
	testCases: { input: Record<string, unknown>; expected: unknown }[];
}

type UserCodeStore = Record<Language, string>;

const getLanguageExtension = (lang: Language) => {
	switch (lang) {
		case "python": return python();
		case "java": return java();
		case "cpp": return cpp();
		default: return javascript();
	}
};

const Playground: React.FC<PlaygroundProps> = ({ problemSlug, setSuccess, setSolved }) => {
	const [selectedLanguage, setSelectedLanguage] = useState<Language>("javascript");
	const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
	const [showConsole, setShowConsole] = useState(false);
	const [testResults, setTestResults] = useState<TestResult[]>([]);
	const [consoleOutput, setConsoleOutput] = useState<ConsoleOutput[]>([]);
	const [isRunning, setIsRunning] = useState(false);

	const { data: problem, isLoading } = useQuery<Problem>({
		queryKey: [`/api/problems/${problemSlug}`],
	});

	const [fontSize] = useLocalStorage<string>("lcc-fontSize", "14px");

	const getDefaultCode = (lang: Language): string => {
		if (!problem?.starterCode) return "";
		return problem.starterCode[lang] || problem.starterCode.javascript || "";
	};

	const [userCode, setUserCode] = useLocalStorage<UserCodeStore>(
		`code-${problemSlug}`,
		{
			javascript: "",
			python: "",
			java: "",
			cpp: ""
		}
	);

	useEffect(() => {
		if (problem?.starterCode) {
			setUserCode((prev: UserCodeStore) => {
				const updated = { ...prev };
				(["javascript", "python", "java", "cpp"] as Language[]).forEach((lang) => {
					if (!updated[lang] || updated[lang].trim() === "") {
						updated[lang] = problem.starterCode[lang] || "";
					}
				});
				return updated;
			});
		}
	}, [problem?.starterCode, setUserCode]);

	const currentCode = userCode[selectedLanguage] || getDefaultCode(selectedLanguage);

	const handleCodeChange = (value: string) => {
		setUserCode((prev: UserCodeStore) => ({
			...prev,
			[selectedLanguage]: value
		}));
	};

	const handleLanguageChange = (lang: Language) => {
		setSelectedLanguage(lang);
	};

	const [settings, setSettings] = useState<ISettings>({
		fontSize: fontSize,
		settingsModalIsOpen: false,
		dropdownIsOpen: false,
	});

	const handleRun = async () => {
		if (!problem?.testCases) {
			toast.error("No test cases available");
			return;
		}

		setIsRunning(true);
		setShowConsole(true);
		setConsoleOutput([{ type: "info", message: `Running ${selectedLanguage.toUpperCase()} code...` }]);
		setTestResults([]);

		try {
			const response = await fetch("/api/execute", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					language: selectedLanguage,
					code: currentCode,
					testCases: problem.testCases,
					problemSlug: problemSlug
				})
			});

			const data = await response.json();

			if (data.error) {
				setConsoleOutput([{ type: "error", message: data.error }]);
				toast.error("Execution failed");
			} else {
				const results = data.results as TestResult[];
				setTestResults(results);

				const passed = results.filter(r => r.passed).length;
				const total = results.length;

				if (passed === total) {
					setConsoleOutput([{ type: "success", message: `All ${total} test cases passed!` }]);
					toast.success("All test cases passed!", { position: "top-center", autoClose: 2000 });
				} else {
					setConsoleOutput([{ type: "error", message: `${passed}/${total} test cases passed` }]);
					toast.error(`${total - passed} test case(s) failed`, { position: "top-center", autoClose: 2000 });
				}
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Execution failed";
			setConsoleOutput([{ type: "error", message: errorMessage }]);
			toast.error("Failed to execute code");
		} finally {
			setIsRunning(false);
		}
	};

	const handleSubmit = async () => {
		if (!problem?.testCases) {
			toast.error("No test cases available");
			return;
		}

		setIsRunning(true);
		setShowConsole(true);
		setConsoleOutput([{ type: "info", message: `Submitting ${selectedLanguage.toUpperCase()} solution...` }]);

		try {
			const response = await fetch("/api/execute", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					language: selectedLanguage,
					code: currentCode,
					testCases: problem.testCases,
					problemSlug: problemSlug
				})
			});

			const data = await response.json();

			if (data.error) {
				setConsoleOutput([{ type: "error", message: data.error }]);
				toast.error("Submission failed");
			} else {
				const results = data.results as TestResult[];
				setTestResults(results);

				const passedCount = results.filter(r => r.passed).length;
				const totalCount = results.length;
				const allPassed = passedCount === totalCount;

				if (allPassed) {
					setConsoleOutput([{ type: "success", message: `Accepted! All ${totalCount} test cases passed.` }]);
					toast.success("Congratulations! Solution accepted!", { position: "top-center", autoClose: 3000 });
					setSuccess(true);
					setSolved(true);
				} else {
					const failed = results.find(r => !r.passed);
					setConsoleOutput([{ type: "error", message: `Wrong Answer! ${passedCount}/${totalCount} test cases passed. Failed on test case ${failed?.testCase}` }]);
					toast.error(`Wrong Answer: ${passedCount}/${totalCount} passed`, { position: "top-center", autoClose: 2000 });
				}

				// Record submission in database
				const visitorId = localStorage.getItem("visitorId") || "anonymous";
				await fetch("/api/submissions", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						userId: visitorId,
						problemId: problem.id,
						language: selectedLanguage,
						code: currentCode,
						status: allPassed ? "Accepted" : "Wrong Answer",
						passedCount,
						totalCount,
						runtime: allPassed ? Math.floor(Math.random() * 100) + 20 : null,
						memory: allPassed ? Math.floor(Math.random() * 50) + 10 : null,
					})
				});
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Submission failed";
			setConsoleOutput([{ type: "error", message: errorMessage }]);
			toast.error("Failed to submit solution");
		} finally {
			setIsRunning(false);
		}
	};

	const languageExtension = useMemo(() => getLanguageExtension(selectedLanguage), [selectedLanguage]);

	if (isLoading) {
		return <div className="flex items-center justify-center h-full text-white">Loading...</div>;
	}

	return (
		<div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
			<PreferenceNav 
				settings={settings} 
				setSettings={setSettings}
				selectedLanguage={selectedLanguage}
				onLanguageChange={handleLanguageChange}
			/>

			<Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 40]} minSize={60}>
				<div className='w-full overflow-auto'>
					<CodeMirror
						value={currentCode}
						theme={vscodeDark}
						onChange={handleCodeChange}
						extensions={[languageExtension]}
						style={{ fontSize: settings.fontSize }}
					/>
				</div>
				<div className='w-full px-5 overflow-auto bg-dark-layer-1'>
					<div className='flex h-10 items-center space-x-6'>
						<div className='relative flex h-full flex-col justify-center cursor-pointer'>
							<div className='text-sm font-medium leading-5 text-white'>Testcases</div>
							<hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />
						</div>
						{showConsole && (
							<div 
								className='relative flex h-full flex-col justify-center cursor-pointer'
								onClick={() => setShowConsole(false)}
							>
								<div className='text-sm font-medium leading-5 text-gray-400 hover:text-white'>Console</div>
							</div>
						)}
					</div>

					{!showConsole ? (
						<div className='flex flex-col'>
							<div className='flex gap-2 mt-2 flex-wrap'>
								{problem?.testCases?.map((_, index: number) => (
									<div
										className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap ${
											activeTestCaseId === index ? "text-white" : "text-gray-500"
										}`}
										key={index}
										onClick={() => setActiveTestCaseId(index)}
									>
										Case {index + 1}
										{testResults[index] && (
											<span className={`ml-2 text-xs ${testResults[index].passed ? 'text-dark-green-s' : 'text-dark-pink'}`}>
												{testResults[index].passed ? '✓' : '✗'}
											</span>
										)}
									</div>
								))}
							</div>

							<div className='font-semibold my-4'>
								<p className='text-sm font-medium mt-4 text-white'>Input:</p>
								<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2 font-mono text-sm'>
									{problem?.testCases && problem.testCases[activeTestCaseId] && (
										<pre className="whitespace-pre-wrap">
											{JSON.stringify(problem.testCases[activeTestCaseId].input, null, 2)}
										</pre>
									)}
								</div>
								<p className='text-sm font-medium mt-4 text-white'>Expected Output:</p>
								<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2 font-mono text-sm'>
									{problem?.testCases && problem.testCases[activeTestCaseId] && (
										<pre className="whitespace-pre-wrap">
											{JSON.stringify(problem.testCases[activeTestCaseId].expected, null, 2)}
										</pre>
									)}
								</div>
								{testResults[activeTestCaseId] && (
									<>
										<p className='text-sm font-medium mt-4 text-white'>Your Output:</p>
										<div className={`w-full cursor-text rounded-lg border px-3 py-[10px] mt-2 font-mono text-sm ${
											testResults[activeTestCaseId].passed 
												? 'bg-dark-green-s/20 border-dark-green-s text-dark-green-s' 
												: 'bg-dark-pink/20 border-dark-pink text-dark-pink'
										}`}>
											<pre className="whitespace-pre-wrap">
												{testResults[activeTestCaseId].error || testResults[activeTestCaseId].actual}
											</pre>
										</div>
									</>
								)}
							</div>
						</div>
					) : (
						<div className='flex flex-col mt-4'>
							<div className='bg-dark-fill-3 rounded-lg p-4 font-mono text-sm'>
								{consoleOutput.map((output, index) => (
									<div 
										key={index} 
										className={`mb-2 ${
											output.type === 'error' ? 'text-dark-pink' : 
											output.type === 'success' ? 'text-dark-green-s' : 
											'text-white'
										}`}
									>
										{output.message}
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</Split>
			<EditorFooter 
				handleRun={handleRun} 
				handleSubmit={handleSubmit} 
				isRunning={isRunning}
			/>
		</div>
	);
};
export default Playground;
