import { type User, type InsertUser, type Problem, type InsertProblem, type Submission, type InsertSubmission, type UserProblem, type InsertUserProblem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Problems
  getProblems(): Promise<Problem[]>;
  getProblem(id: string): Promise<Problem | undefined>;
  getProblemBySlug(slug: string): Promise<Problem | undefined>;
  createProblem(problem: InsertProblem): Promise<Problem>;
  
  // Submissions
  getSubmissions(userId: string, problemId?: string): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  
  // User Problems
  getUserProblem(userId: string, problemId: string): Promise<UserProblem | undefined>;
  createUserProblem(userProblem: InsertUserProblem): Promise<UserProblem>;
  updateUserProblem(userId: string, problemId: string, updates: Partial<UserProblem>): Promise<UserProblem>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private problems: Map<string, Problem>;
  private submissions: Map<string, Submission>;
  private userProblems: Map<string, UserProblem>;

  constructor() {
    this.users = new Map();
    this.problems = new Map();
    this.submissions = new Map();
    this.userProblems = new Map();
    
    // Initialize with sample problems
    this.initializeProblems();
  }

  private initializeProblems() {
    const sampleProblems: InsertProblem[] = [
      {
        title: "Two Sum",
        slug: "two-sum",
        difficulty: "Easy",
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          },
          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]"
          }
        ],
        constraints: [
          "2 ≤ nums.length ≤ 10⁴",
          "-10⁹ ≤ nums[i] ≤ 10⁹",
          "-10⁹ ≤ target ≤ 10⁹",
          "Only one valid answer exists."
        ],
        topics: ["Array", "Hash Table"],
        acceptance: 49,
        submissions: 5200000,
        accepted: 2600000,
        starterCode: {
          javascript: `function twoSum(nums, target) {
    // Write your code here
};`,
          python: `def twoSum(nums, target):
    # Write your code here
    pass`
        },
        testCases: [
          { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] }
        ]
      },
      {
        title: "2. Reverse Linked List",
        slug: "reverse-linked-list",
        difficulty: "Easy",
        description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
        examples: [
          {
            input: "head = [1,2,3,4,5]",
            output: "[5,4,3,2,1]",
            explanation: "The linked list is reversed."
          },
          {
            input: "head = [1,2,3]",
            output: "[3,2,1]"
          },
          {
            input: "head = [1]",
            output: "[1]"
          }
        ],
        constraints: [
          "The number of nodes in the list is the range [0, 5000].",
          "-5000 <= Node.val <= 5000"
        ],
        topics: ["Linked List", "Recursion"],
        acceptance: 73,
        submissions: 2800000,
        accepted: 2044000,
        starterCode: {
          javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
function reverseLinkedList(head) {
    // Write your code here
};`,
          python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
def reverseLinkedList(head):
    # Write your code here
    pass`
        },
        testCases: [
          { input: { head: [1, 2, 3, 4, 5] }, expected: [5, 4, 3, 2, 1] },
          { input: { head: [1, 2, 3] }, expected: [3, 2, 1] },
          { input: { head: [1] }, expected: [1] }
        ]
      },
      {
        title: "3. Jump Game",
        slug: "jump-game",
        difficulty: "Medium",
        description: `You are given an integer array nums. You are initially positioned at the first index and each element in the array represents your maximum jump length at that position.

Return true if you can reach the last index, or false otherwise.`,
        examples: [
          {
            input: "nums = [2,3,1,1,4]",
            output: "true",
            explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index."
          },
          {
            input: "nums = [3,2,1,0,4]",
            output: "false",
            explanation: "You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index."
          }
        ],
        constraints: [
          "1 <= nums.length <= 10^4",
          "0 <= nums[i] <= 10^5"
        ],
        topics: ["Array", "Dynamic Programming", "Greedy"],
        acceptance: 38,
        submissions: 2100000,
        accepted: 798000,
        starterCode: {
          javascript: `function canJump(nums) {
    // Write your code here
};`,
          python: `def canJump(nums):
    # Write your code here
    pass`
        },
        testCases: [
          { input: { nums: [2, 3, 1, 1, 4] }, expected: true },
          { input: { nums: [3, 2, 1, 0, 4] }, expected: false },
          { input: { nums: [2, 0, 0] }, expected: true }
        ]
      },
      {
        title: "4. Valid Parentheses",
        slug: "valid-parentheses",
        difficulty: "Easy",
        description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
• Open brackets must be closed by the same type of brackets.
• Open brackets must be closed in the correct order.
• Every close bracket has a corresponding open bracket of the same type.`,
        examples: [
          {
            input: 's = "()"',
            output: "true"
          },
          {
            input: 's = "()[]{}"',
            output: "true"
          },
          {
            input: 's = "(]"',
            output: "false"
          },
          {
            input: 's = "([)]"',
            output: "false"
          }
        ],
        constraints: [
          "1 <= s.length <= 10⁴",
          "s consists of parentheses only '()[]{}'."
        ],
        topics: ["String", "Stack"],
        acceptance: 40,
        submissions: 3200000,
        accepted: 1280000,
        starterCode: {
          javascript: `function validParentheses(s) {
    // Write your code here
};`,
          python: `def validParentheses(s):
    # Write your code here
    pass`
        },
        testCases: [
          { input: { s: "()" }, expected: true },
          { input: { s: "()[]{}" }, expected: true },
          { input: { s: "(]" }, expected: false },
          { input: { s: "([)]" }, expected: false }
        ]
      },
      {
        title: "5. Search a 2D Matrix",
        slug: "search-a-2d-matrix",
        difficulty: "Medium",
        description: `Write an efficient algorithm that searches for a value in an m x n matrix. This matrix has the following properties:

• Integers in each row are sorted from left to right.
• The first integer of each row is greater than the last integer of the previous row.

Given matrix, an m x n matrix, and target, return true if target is in the matrix, and false otherwise.`,
        examples: [
          {
            input: `matrix = [
  [1,3,5,7],
  [10,11,16,20],
  [23,30,34,60]
], target = 3`,
            output: "true"
          },
          {
            input: `matrix = [
  [1,3,5,7],
  [10,11,16,20],
  [23,30,34,60]
], target = 13`,
            output: "false"
          },
          {
            input: "matrix = [[1]], target = 1",
            output: "true"
          }
        ],
        constraints: [
          "m == matrix.length",
          "n == matrix[i].length",
          "1 <= m, n <= 100",
          "-10⁴ <= matrix[i][j], target <= 10⁴"
        ],
        topics: ["Array", "Binary Search", "Matrix"],
        acceptance: 45,
        submissions: 1800000,
        accepted: 810000,
        starterCode: {
          javascript: `function searchMatrix(matrix, target) {
    // Write your code here
};`,
          python: `def searchMatrix(matrix, target):
    # Write your code here
    pass`
        },
        testCases: [
          { input: { matrix: [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target: 3 }, expected: true },
          { input: { matrix: [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target: 13 }, expected: false }
        ]
      }
    ];

    sampleProblems.forEach(problemData => {
      this.createProblem(problemData);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      avatar: insertUser.avatar || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getProblems(): Promise<Problem[]> {
    return Array.from(this.problems.values());
  }

  async getProblem(id: string): Promise<Problem | undefined> {
    return this.problems.get(id);
  }

  async getProblemBySlug(slug: string): Promise<Problem | undefined> {
    return Array.from(this.problems.values()).find(problem => problem.slug === slug);
  }

  async createProblem(insertProblem: InsertProblem): Promise<Problem> {
    const id = randomUUID();
    const problem: Problem = { 
      ...insertProblem, 
      id,
      submissions: insertProblem.submissions || 0,
      acceptance: insertProblem.acceptance || 0,
      accepted: insertProblem.accepted || 0,
      constraints: insertProblem.constraints || [],
      topics: insertProblem.topics || [],
      createdAt: new Date()
    };
    this.problems.set(id, problem);
    return problem;
  }

  async getSubmissions(userId: string, problemId?: string): Promise<Submission[]> {
    const submissions = Array.from(this.submissions.values()).filter(
      submission => submission.userId === userId && (!problemId || submission.problemId === problemId)
    );
    return submissions;
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = randomUUID();
    const submission: Submission = { 
      ...insertSubmission, 
      id,
      runtime: insertSubmission.runtime || null,
      memory: insertSubmission.memory || null,
      createdAt: new Date()
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async getUserProblem(userId: string, problemId: string): Promise<UserProblem | undefined> {
    const key = `${userId}-${problemId}`;
    return this.userProblems.get(key);
  }

  async createUserProblem(insertUserProblem: InsertUserProblem): Promise<UserProblem> {
    const id = randomUUID();
    const userProblem: UserProblem = { 
      ...insertUserProblem, 
      id,
      solved: insertUserProblem.solved || false,
      attempts: insertUserProblem.attempts || 0,
      lastAttemptAt: insertUserProblem.lastAttemptAt || null
    };
    const key = `${userProblem.userId}-${userProblem.problemId}`;
    this.userProblems.set(key, userProblem);
    return userProblem;
  }

  async updateUserProblem(userId: string, problemId: string, updates: Partial<UserProblem>): Promise<UserProblem> {
    const key = `${userId}-${problemId}`;
    const existing = this.userProblems.get(key);
    if (!existing) {
      throw new Error("UserProblem not found");
    }
    const updated = { ...existing, ...updates };
    this.userProblems.set(key, updated);
    return updated;
  }
}

export const storage = new MemStorage();
