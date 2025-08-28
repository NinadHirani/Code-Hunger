export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: any;
  expected: any;
}

export interface StarterCode {
  [language: string]: string;
}

export interface ProblemWithStatus {
  id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  topics: string[];
  acceptance: number;
  submissions: number;
  accepted: number;
  starterCode: StarterCode;
  testCases: TestCase[];
  solved?: boolean;
  attempts?: number;
  createdAt: Date;
}

export type Language = "javascript" | "python" | "java" | "cpp";

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  language: string;
  code: string;
  status: string;
  runtime?: number;
  memory?: number;
  createdAt: Date;
}
