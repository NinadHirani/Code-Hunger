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

const dataStructureHelpers = `
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}

function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val);
  this.left = (left === undefined ? null : left);
  this.right = (right === undefined ? null : right);
}

function arrayToLinkedList(arr) {
  if (!arr || arr.length === 0) return null;
  const head = new ListNode(arr[0]);
  let current = head;
  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }
  return head;
}

function linkedListToArray(head) {
  const result = [];
  let current = head;
  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

function arrayToTree(arr) {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function treeToArray(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node) {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      result.push(null);
    }
  }
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}
`;

const linkedListProblems = ['reverse-linked-list', 'merge-two-sorted-lists', 'linked-list-cycle', 'remove-nth-node-from-end-of-list'];
const treeProblems = ['maximum-depth-of-binary-tree', 'invert-binary-tree', 'same-tree', 'symmetric-tree', 'binary-tree-level-order-traversal'];

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

	const isLinkedListProblem = linkedListProblems.includes(problemSlug);
	const isTreeProblem = treeProblems.includes(problemSlug);

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
				let execCode = '';
				
				if (isLinkedListProblem) {
					execCode = `
						${dataStructureHelpers}
						${userCode}
						const input = ${JSON.stringify(testCase.input)};
						const args = Object.entries(input).map(([key, val]) => {
							if (key === 'head' || key === 'l1' || key === 'l2' || key === 'list1' || key === 'list2') {
								return arrayToLinkedList(val);
							}
							return val;
						});
						const rawResult = ${functionName}(...args);
						return linkedListToArray(rawResult);
					`;
				} else if (isTreeProblem) {
					execCode = `
						${dataStructureHelpers}
						${userCode}
						const input = ${JSON.stringify(testCase.input)};
						const args = Object.entries(input).map(([key, val]) => {
							if (key === 'root' || key === 'p' || key === 'q' || key === 'tree1' || key === 'tree2') {
								return arrayToTree(val);
							}
							return val;
						});
						const rawResult = ${functionName}(...args);
						if (typeof rawResult === 'number' || typeof rawResult === 'boolean') {
							return rawResult;
						}
						return treeToArray(rawResult);
					`;
				} else {
					execCode = `
						${userCode}
						const input = ${JSON.stringify(testCase.input)};
						const args = Object.values(input);
						return ${functionName}(...args);
					`;
				}
				
				const fn = new Function(execCode);
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
