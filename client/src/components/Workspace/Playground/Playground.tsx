import { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
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

const Playground: React.FC<PlaygroundProps> = ({ problemSlug, setSuccess, setSolved }) => {
	const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
	const [userCode, setUserCode] = useState<string>("");
	const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");
	const [isRunning, setIsRunning] = useState(false);
	const [showConsole, setShowConsole] = useState(false);
	const [consoleOutput, setConsoleOutput] = useState<ConsoleOutput[]>([]);
	const [testResults, setTestResults] = useState<TestResult[]>([]);

	const [settings, setSettings] = useState<ISettings>({
		fontSize: fontSize,
		settingsModalIsOpen: false,
		dropdownIsOpen: false,
	});

	const { data: problem } = useQuery({
		queryKey: [`/api/problems/${problemSlug}`],
		enabled: !!problemSlug
	});

	const getFunctionName = (code: string): string | null => {
		const match = code.match(/function\s+(\w+)\s*\(/);
		return match ? match[1] : null;
	};

	const executeCode = (userCode: string, testCases: any[]): TestResult[] => {
		const results: TestResult[] = [];
		const functionName = getFunctionName(userCode);
		
		if (!functionName) {
			return [{
				testCase: 0,
				passed: false,
				input: "",
				expected: "",
				actual: "",
				error: "Could not find function definition. Make sure your code defines a function."
			}];
		}

		for (let i = 0; i < testCases.length; i++) {
			const testCase = testCases[i];
			try {
				const fn = new Function(`
					${userCode}
					const input = ${JSON.stringify(testCase.input)};
					const args = Object.values(input);
					return ${functionName}(...args);
				`);
				
				const result = fn();
				const expected = testCase.expected;
				
				const isEqual = JSON.stringify(result) === JSON.stringify(expected) ||
					(Array.isArray(result) && Array.isArray(expected) && 
					 result.length === expected.length && 
					 result.every((v, idx) => JSON.stringify(v) === JSON.stringify(expected[idx])));
				
				results.push({
					testCase: i + 1,
					passed: isEqual,
					input: JSON.stringify(testCase.input),
					expected: JSON.stringify(expected),
					actual: JSON.stringify(result),
				});
			} catch (error: any) {
				results.push({
					testCase: i + 1,
					passed: false,
					input: JSON.stringify(testCase.input),
					expected: JSON.stringify(testCase.expected),
					actual: "Error",
					error: error.message || "Runtime error occurred"
				});
			}
		}
		
		return results;
	};

	const handleRun = async () => {
		if (!problem || !problem.testCases) {
			toast.error("Problem test cases not found", {
				position: "top-center",
				autoClose: 3000,
				theme: "dark",
			});
			return;
		}

		setIsRunning(true);
		setShowConsole(true);
		setConsoleOutput([{ type: "info", message: "Running test cases..." }]);

		await new Promise(resolve => setTimeout(resolve, 500));

		const results = executeCode(userCode, problem.testCases as any[]);
		setTestResults(results);

		const newOutput: ConsoleOutput[] = [{ type: "info", message: "Test Results:" }];
		
		results.forEach((result) => {
			if (result.error) {
				newOutput.push({
					type: "error",
					message: `Test Case ${result.testCase}: Error - ${result.error}`
				});
			} else if (result.passed) {
				newOutput.push({
					type: "success",
					message: `Test Case ${result.testCase}: Passed`
				});
			} else {
				newOutput.push({
					type: "error",
					message: `Test Case ${result.testCase}: Failed`
				});
				newOutput.push({
					type: "result",
					message: `  Input: ${result.input}`
				});
				newOutput.push({
					type: "result",
					message: `  Expected: ${result.expected}`
				});
				newOutput.push({
					type: "error",
					message: `  Your Output: ${result.actual}`
				});
			}
		});

		const allPassed = results.every(r => r.passed);
		if (allPassed) {
			newOutput.push({ type: "success", message: "\nAll test cases passed!" });
		} else {
			const passedCount = results.filter(r => r.passed).length;
			newOutput.push({ 
				type: "error", 
				message: `\n${passedCount}/${results.length} test cases passed.` 
			});
		}

		setConsoleOutput(newOutput);
		setIsRunning(false);
	};

	const handleSubmit = async () => {
		if (!problem || !problem.testCases) {
			toast.error("Problem not found", {
				position: "top-center",
				autoClose: 3000,
				theme: "dark",
			});
			return;
		}

		setIsRunning(true);
		setShowConsole(true);
		setConsoleOutput([{ type: "info", message: "Submitting solution..." }]);

		await new Promise(resolve => setTimeout(resolve, 500));

		const results = executeCode(userCode, problem.testCases as any[]);
		setTestResults(results);

		const allPassed = results.every(r => r.passed);

		if (allPassed) {
			toast.success("Congrats! All tests passed!", {
				position: "top-center",
				autoClose: 3000,
				theme: "dark",
			});
			setSuccess(true);
			setTimeout(() => {
				setSuccess(false);
			}, 4000);

			const solvedProblems = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
			if (!solvedProblems.includes(problemSlug)) {
				solvedProblems.push(problemSlug);
				localStorage.setItem("solvedProblems", JSON.stringify(solvedProblems));
			}
			setSolved(true);

			setConsoleOutput([
				{ type: "success", message: "Accepted!" },
				{ type: "success", message: `All ${results.length} test cases passed.` }
			]);
		} else {
			const passedCount = results.filter(r => r.passed).length;
			toast.error(`${passedCount}/${results.length} test cases passed`, {
				position: "top-center",
				autoClose: 3000,
				theme: "dark",
			});

			const newOutput: ConsoleOutput[] = [
				{ type: "error", message: "Wrong Answer" },
				{ type: "info", message: `${passedCount}/${results.length} test cases passed.` },
				{ type: "info", message: "" }
			];

			const firstFailed = results.find(r => !r.passed);
			if (firstFailed) {
				if (firstFailed.error) {
					newOutput.push({ type: "error", message: `Runtime Error: ${firstFailed.error}` });
				} else {
					newOutput.push({ type: "result", message: `Failed Test Case ${firstFailed.testCase}:` });
					newOutput.push({ type: "result", message: `Input: ${firstFailed.input}` });
					newOutput.push({ type: "result", message: `Expected: ${firstFailed.expected}` });
					newOutput.push({ type: "error", message: `Your Output: ${firstFailed.actual}` });
				}
			}

			setConsoleOutput(newOutput);
		}

		setIsRunning(false);
	};

	useEffect(() => {
		if (problem && problem.starterCode) {
			const code = localStorage.getItem(`code-${problemSlug}`);
			const starterCode = (problem.starterCode as Record<string, string>);
			setUserCode(code ? JSON.parse(code) : starterCode.javascript || "");
		}
	}, [problemSlug, problem]);

	const onChange = (value: string) => {
		setUserCode(value);
		localStorage.setItem(`code-${problemSlug}`, JSON.stringify(value));
	};

	if (!problem) {
		return <div>Loading...</div>;
	}

	return (
		<div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
			<PreferenceNav settings={settings} setSettings={setSettings} />

			<Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 40]} minSize={60}>
				<div className='w-full overflow-auto'>
					<CodeMirror
						value={userCode}
						theme={vscodeDark}
						onChange={onChange}
						extensions={[javascript()]}
						style={{ fontSize: settings.fontSize }}
					/>
				</div>
				<div className='w-full px-5 overflow-auto'>
					<div className='flex h-10 items-center space-x-6'>
						<div 
							className={`relative flex h-full flex-col justify-center cursor-pointer ${!showConsole ? 'text-white' : 'text-gray-500'}`}
							onClick={() => setShowConsole(false)}
						>
							<div className='text-sm font-medium leading-5'>Testcases</div>
							{!showConsole && <hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />}
						</div>
						<div 
							className={`relative flex h-full flex-col justify-center cursor-pointer ${showConsole ? 'text-white' : 'text-gray-500'}`}
							onClick={() => setShowConsole(true)}
						>
							<div className='text-sm font-medium leading-5'>Console</div>
							{showConsole && <hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />}
						</div>
					</div>

					{!showConsole ? (
						<>
							<div className='flex'>
								{problem.examples && (problem.examples as any[]).map((example, index) => (
									<div
										className='mr-2 items-start mt-2 '
										key={index}
										onClick={() => setActiveTestCaseId(index)}
									>
										<div className='flex flex-wrap items-center gap-y-4'>
											<div
												className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
												${activeTestCaseId === index ? "text-white" : "text-gray-500"}
											`}
											>
												Case {index + 1}
											</div>
										</div>
									</div>
								))}
							</div>

							{problem.examples && (problem.examples as any[])[activeTestCaseId] && (
								<div className='font-semibold my-4'>
									<p className='text-sm font-medium mt-4 text-white'>Input:</p>
									<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
										{(problem.examples as any[])[activeTestCaseId].input}
									</div>
									<p className='text-sm font-medium mt-4 text-white'>Output:</p>
									<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
										{(problem.examples as any[])[activeTestCaseId].output}
									</div>
								</div>
							)}
						</>
					) : (
						<div className='mt-4 font-mono text-sm bg-dark-fill-3 rounded-lg p-4 min-h-[150px] max-h-[300px] overflow-auto'>
							{consoleOutput.length === 0 ? (
								<div className='text-gray-500'>Run your code to see output here...</div>
							) : (
								consoleOutput.map((output, index) => (
									<div
										key={index}
										className={`${
											output.type === "success" ? "text-green-500" :
											output.type === "error" ? "text-red-500" :
											output.type === "info" ? "text-gray-400" :
											"text-white"
										}`}
									>
										{output.message}
									</div>
								))
							)}
						</div>
					)}
				</div>
			</Split>
			<EditorFooter 
				handleRun={handleRun}
				handleSubmit={handleSubmit}
				isRunning={isRunning}
				showConsole={showConsole}
				onToggleConsole={() => setShowConsole(!showConsole)}
			/>
		</div>
	);
};
export default Playground;
