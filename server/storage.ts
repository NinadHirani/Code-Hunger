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
      },
      {
        title: "6. Container With Most Water",
        slug: "container-with-most-water",
        difficulty: "Medium",
        description: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

Notice that you may not slant the container.`,
        examples: [
          {
            input: "height = [1,8,6,2,5,4,8,3,7]",
            output: "49",
            explanation: "The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49."
          },
          {
            input: "height = [1,1]",
            output: "1"
          }
        ],
        constraints: [
          "n == height.length",
          "2 <= n <= 10⁵",
          "0 <= height[i] <= 10⁴"
        ],
        topics: ["Array", "Two Pointers", "Greedy"],
        acceptance: 54,
        submissions: 1900000,
        accepted: 1026000,
        starterCode: {
          javascript: `function maxArea(height) {
    // Write your code here
};`,
          python: `def maxArea(height):
    # Write your code here
    pass`
        },
        testCases: [
          { input: { height: [1,8,6,2,5,4,8,3,7] }, expected: 49 },
          { input: { height: [1,1] }, expected: 1 }
        ]
      },
      {
        title: "7. Merge Intervals",
        slug: "merge-intervals",
        difficulty: "Medium",
        description: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
        examples: [
          {
            input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
            output: "[[1,6],[8,10],[15,18]]",
            explanation: "Since intervals [1,3] and [2,6] overlaps, merge them into [1,6]."
          },
          {
            input: "intervals = [[1,4],[4,5]]",
            output: "[[1,5]]",
            explanation: "Intervals [1,4] and [4,5] are considered overlapping."
          }
        ],
        constraints: [
          "1 <= intervals.length <= 10⁴",
          "intervals[i].length == 2",
          "0 <= starti <= endi <= 10⁴"
        ],
        topics: ["Array", "Sorting"],
        acceptance: 46,
        submissions: 1500000,
        accepted: 690000,
        starterCode: {
          javascript: `function merge(intervals) {
    // Write your code here
};`,
          python: `def merge(intervals):
    # Write your code here
    pass`
        },
        testCases: [
          { input: { intervals: [[1,3],[2,6],[8,10],[15,18]] }, expected: [[1,6],[8,10],[15,18]] },
          { input: { intervals: [[1,4],[4,5]] }, expected: [[1,5]] }
        ]
      },
      {
        title: "8. Maximum Depth of Binary Tree",
        slug: "maximum-depth-of-binary-tree",
        difficulty: "Easy",
        description: `Given the root of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
        examples: [
          {
            input: "root = [3,9,20,null,null,15,7]",
            output: "3"
          },
          {
            input: "root = [1,null,2]",
            output: "2"
          }
        ],
        constraints: [
          "The number of nodes in the tree is in the range [0, 10⁴].",
          "-100 <= Node.val <= 100"
        ],
        topics: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
        acceptance: 74,
        submissions: 2200000,
        accepted: 1628000,
        starterCode: {
          javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
function maxDepth(root) {
    // Write your code here
};`,
          python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
def maxDepth(root):
    # Write your code here
    pass`
        },
        testCases: [
          { input: { root: [3,9,20,null,null,15,7] }, expected: 3 },
          { input: { root: [1,null,2] }, expected: 2 }
        ]
      },
      {
        title: "9. Best Time to Buy and Sell Stock",
        slug: "best-time-to-buy-and-sell-stock",
        difficulty: "Easy",
        description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
        examples: [
          {
            input: "prices = [7,1,5,3,6,4]",
            output: "5",
            explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
          },
          {
            input: "prices = [7,6,4,3,1]",
            output: "0",
            explanation: "In this case, no transactions are done and the max profit = 0."
          }
        ],
        constraints: [
          "1 <= prices.length <= 10⁵",
          "0 <= prices[i] <= 10⁴"
        ],
        topics: ["Array", "Dynamic Programming"],
        acceptance: 54,
        submissions: 2400000,
        accepted: 1296000,
        starterCode: {
          javascript: `function maxProfit(prices) {
    // Write your code here
};`,
          python: `def maxProfit(prices):
    # Write your code here
    pass`
        },
        testCases: [
          { input: { prices: [7,1,5,3,6,4] }, expected: 5 },
          { input: { prices: [7,6,4,3,1] }, expected: 0 }
        ]
      },
      {
        title: "10. Subsets",
        slug: "subsets",
        difficulty: "Medium", 
        description: `Given an integer array nums of unique elements, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Return the solution in any order.`,
        examples: [
          {
            input: "nums = [1,2,3]",
            output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]"
          },
          {
            input: "nums = [0]",
            output: "[[],[0]]"
          }
        ],
        constraints: [
          "1 <= nums.length <= 10",
          "-10 <= nums[i] <= 10",
          "All the numbers of nums are unique."
        ],
        topics: ["Array", "Backtracking", "Bit Manipulation"],
        acceptance: 75,
        submissions: 1300000,
        accepted: 975000,
        starterCode: {
          javascript: `function subsets(nums) {
    // Write your code here
};`,
          python: `def subsets(nums):
    # Write your code here
    pass`
        },
        testCases: [
          { input: { nums: [1,2,3] }, expected: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]] },
          { input: { nums: [0] }, expected: [[],[0]] }
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
