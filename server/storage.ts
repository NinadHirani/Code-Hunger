import { type User, type InsertUser, type Problem, type InsertProblem, type Submission, type InsertSubmission, type UserProblem, type InsertUserProblem, type Contest, type InsertContest, type ContestParticipant, type InsertContestParticipant, type Badge, type UserBadge, type UserStreak, type RewardPoint } from "@shared/schema";
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
  getSubmissionsWithDetails(userId: string): Promise<any[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  
  // User Problems
  getUserProblem(userId: string, problemId: string): Promise<UserProblem | undefined>;
  createUserProblem(userProblem: InsertUserProblem): Promise<UserProblem>;
  updateUserProblem(userId: string, problemId: string, updates: Partial<UserProblem>): Promise<UserProblem>;

  // User Problem Interactions
  getUserProblemInteraction(visitorId: string, problemSlug: string): Promise<any>;
  toggleLike(visitorId: string, problemSlug: string): Promise<any>;
  toggleDislike(visitorId: string, problemSlug: string): Promise<any>;
  toggleStar(visitorId: string, problemSlug: string): Promise<any>;
  getAllInteractions(visitorId: string): Promise<any[]>;

  // Contests
  getContests(): Promise<Contest[]>;
  getContest(id: string): Promise<Contest | undefined>;
  createContest(contest: InsertContest): Promise<Contest>;
  getContestParticipants(contestId: string): Promise<ContestParticipant[]>;
  joinContest(participant: InsertContestParticipant): Promise<ContestParticipant>;
  updateContestParticipant(contestId: string, userId: string, updates: Partial<ContestParticipant>): Promise<ContestParticipant>;

  // Gamification & Streaks
  getUserStreak(userId: string): Promise<UserStreak | undefined>;
  updateUserStreak(userId: string): Promise<UserStreak>;
  getBadges(): Promise<Badge[]>;
  getUserBadges(userId: string): Promise<UserBadge[]>;
  awardBadge(userId: string, badgeId: string): Promise<UserBadge>;
  getRewardPoints(userId: string): Promise<RewardPoint | undefined>;
  addRewardPoints(userId: string, points: number): Promise<RewardPoint>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private problems: Map<string, Problem>;
  private submissions: Map<string, Submission>;
  private userProblems: Map<string, UserProblem>;
  private userInteractions: Map<string, { liked: boolean; disliked: boolean; starred: boolean; solved: boolean }>;
  private contests: Map<string, Contest>;
  private contestParticipants: Map<string, ContestParticipant>;
  private badges: Map<string, Badge>;
  private userBadges: Map<string, UserBadge>;
  private userStreaks: Map<string, UserStreak>;
  private rewardPoints: Map<string, RewardPoint>;

  constructor() {
    this.users = new Map();
    this.problems = new Map();
    this.submissions = new Map();
    this.userProblems = new Map();
    this.userInteractions = new Map();
    this.contests = new Map();
    this.contestParticipants = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    this.userStreaks = new Map();
    this.rewardPoints = new Map();
    
    // Initialize with sample data
    this.initializeProblems();
    this.initializeContests();
    this.initializeBadges();
  }

  private initializeProblems() {
    const sampleProblems: InsertProblem[] = [
      {
        title: "Two Sum",
        slug: "two-sum",
        difficulty: "Easy",
        order: 1,
        videoId: "8-k1C6ehKuw",
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
            python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your code here
        pass`,
          java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
    }
}`,
          cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
    }
};`
        },
          testCases: [
            { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
            { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] }
          ]
        },
      {
        title: "Reverse Linked List",
      slug: "reverse-linked-list",
      difficulty: "Easy",
      order: 2,
      videoId: "G0_I-ZF0S38",
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
function reverseList(head) {
    // Write your code here
};`,
          python: `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Write your code here
        pass`,
        java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your code here
    }
}`,
        cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Write your code here
    }
};`
      },
      testCases: [
        { input: { head: [1, 2, 3, 4, 5] }, expected: [5, 4, 3, 2, 1] },
        { input: { head: [1, 2, 3] }, expected: [3, 2, 1] },
        { input: { head: [1] }, expected: [1] },
        { input: { head: [] }, expected: [] }
      ]
    },
      {
        title: "Jump Game",
        slug: "jump-game",
        difficulty: "Medium",
        order: 3,
        videoId: "Yan0cv2cUCc",
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
            python: `class Solution:
    def canJump(self, nums: List[int]) -> bool:
        # Write your code here
        pass`,
          java: `class Solution {
    public boolean canJump(int[] nums) {
        // Write your code here
    }
}`,
          cpp: `class Solution {
public:
    bool canJump(vector<int>& nums) {
        // Write your code here
    }
};`
        },
        testCases: [
          { input: { nums: [2, 3, 1, 1, 4] }, expected: true },
          { input: { nums: [3, 2, 1, 0, 4] }, expected: false },
          { input: { nums: [2, 0, 0] }, expected: true }
        ]
      },
      {
        title: "Palindrome Number",
        slug: "palindrome-number",
        difficulty: "Easy",
        order: 4,
        videoId: "yubRKwCPyAg",
        description: `Given an integer x, return true if x is a palindrome, and false otherwise.`,
        examples: [
          { input: "x = 121", output: "true", explanation: "121 reads as 121 from left to right and from right to left." },
          { input: "x = -121", output: "false", explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome." }
        ],
        constraints: ["-2^31 <= x <= 2^31 - 1"],
        topics: ["Math"],
        starterCode: {
          javascript: `function isPalindrome(x) {\n    // Write your code here\n};`,
          python: `class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        # Write your code here\n        pass`,
          java: `class Solution {\n    public boolean isPalindrome(int x) {\n        // Write your code here\n    }\n}`,
          cpp: `class Solution {\npublic:\n    bool isPalindrome(int x) {\n        // Write your code here\n    }\n};`
        },
        testCases: [
          { input: { x: 121 }, expected: true },
          { input: { x: -121 }, expected: false },
          { input: { x: 10 }, expected: false }
        ]
      },
      {
        title: "Valid Parentheses",
        slug: "valid-parentheses",
        difficulty: "Easy",
        order: 5,
        videoId: "WTwjK_uyukU",
        description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.`,
        examples: [
          { input: 's = "()"', output: "true" },
          { input: 's = "()[]{}"', output: "true" },
          { input: 's = "(]"', output: "false" }
        ],
        constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
        topics: ["String", "Stack"],
        starterCode: {
          javascript: `function isValid(s) {\n    // Write your code here\n};`,
          python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write your code here\n        pass`,
          java: `class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n    }\n}`,
          cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n    }\n};`
        },
        testCases: [
          { input: { s: "()" }, expected: true },
          { input: { s: "()[]{}" }, expected: true },
          { input: { s: "(]" }, expected: false }
        ]
      },
      {
        title: "Merge Two Sorted Lists",
        slug: "merge-two-sorted-lists",
        difficulty: "Easy",
        order: 6,
        videoId: "XIdigkFu7uM",
        description: `You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.`,
        examples: [
          { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }
        ],
        constraints: ["The number of nodes in both lists is in the range [0, 50].", "-100 <= Node.val <= 100"],
        topics: ["Linked List", "Recursion"],
        starterCode: {
          javascript: `function mergeTwoLists(list1, list2) {\n    // Write your code here\n};`,
          python: `class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your code here\n        pass`,
          java: `class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n    }\n}`,
          cpp: `class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        // Write your code here\n    }\n};`
        },
        testCases: [
          { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, expected: [1, 1, 2, 3, 4, 4] }
        ]
      },
      {
        title: "Maximum Subarray",
        slug: "maximum-subarray",
        difficulty: "Medium",
        order: 7,
        videoId: "5WZlOhjuU1w",
        description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
        examples: [
          { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." }
        ],
        constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
        topics: ["Array", "Divide and Conquer", "Dynamic Programming"],
        starterCode: {
          javascript: `function maxSubArray(nums) {\n    // Write your code here\n};`,
          python: `class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        # Write your code here\n        pass`,
          java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n    }\n}`,
          cpp: `class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your code here\n    }\n};`
        },
        testCases: [
          { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6 },
          { input: { nums: [1] }, expected: 1 },
          { input: { nums: [5, 4, -1, 7, 8] }, expected: 23 }
        ]
      },
      {
        title: "Search Insert Position",
        slug: "search-insert-position",
        difficulty: "Easy",
        order: 8,
        videoId: "K-RYzDZkzCI",
        description: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.`,
        examples: [
          { input: "nums = [1,3,5,6], target = 5", output: "2" },
          { input: "nums = [1,3,5,6], target = 2", output: "1" }
        ],
        constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4", "nums contains distinct values sorted in ascending order."],
        topics: ["Array", "Binary Search"],
        starterCode: {
          javascript: `function searchInsert(nums, target) {\n    // Write your code here\n};`,
          python: `class Solution:\n    def searchInsert(self, nums: List[int], target: int) -> int:\n        # Write your code here\n        pass`,
          java: `class Solution {\n    public int searchInsert(int[] nums, int target) {\n        // Write your code here\n    }\n}`,
          cpp: `class Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};`
        },
        testCases: [
          { input: { nums: [1, 3, 5, 6], target: 5 }, expected: 2 },
          { input: { nums: [1, 3, 5, 6], target: 2 }, expected: 1 },
          { input: { nums: [1, 3, 5, 6], target: 7 }, expected: 4 }
        ]
      },
      {
        title: "Climbing Stairs",
        slug: "climbing-stairs",
        difficulty: "Easy",
        order: 9,
        videoId: "yFE628G-_ko",
        description: `You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
        examples: [
          { input: "n = 2", output: "2" },
          { input: "n = 3", output: "3" }
        ],
        constraints: ["1 <= n <= 45"],
        topics: ["Math", "Dynamic Programming", "Memoization"],
        starterCode: {
          javascript: `function climbStairs(n) {\n    // Write your code here\n};`,
          python: `class Solution:\n    def climbStairs(self, n: int) -> int:\n        # Write your code here\n        pass`,
          java: `class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n    }\n}`,
          cpp: `class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your code here\n    }\n};`
        },
        testCases: [
          { input: { n: 2 }, expected: 2 },
          { input: { n: 3 }, expected: 3 }
        ]
      },
      {
        title: "Binary Tree Inorder Traversal",
        slug: "binary-tree-inorder-traversal",
        difficulty: "Easy",
        order: 10,
        videoId: "jzZgF8n2vRE",
        description: `Given the root of a binary tree, return the inorder traversal of its nodes' values.`,
        examples: [
          { input: "root = [1,null,2,3]", output: "[1,3,2]" }
        ],
        constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
        topics: ["Stack", "Tree", "Depth-First Search", "Binary Tree"],
        starterCode: {
          javascript: `function inorderTraversal(root) {\n    // Write your code here\n};`,
          python: `class Solution:\n    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:\n        # Write your code here\n        pass`,
          java: `class Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        // Write your code here\n    }\n}`,
          cpp: `class Solution {\npublic:\n    vector<int> inorderTraversal(TreeNode* root) {\n        // Write your code here\n    }\n};`
        },
        testCases: [
          { input: { root: [1, null, 2, 3] }, expected: [1, 3, 2] }
        ]
      },
      {
        title: "Symmetric Tree",
        slug: "symmetric-tree",
        difficulty: "Easy",
        order: 11,
        videoId: "K7LyJT17u6E",
        description: `Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).`,
        examples: [
          { input: "root = [1,2,2,3,4,4,3]", output: "true" }
        ],
        constraints: ["The number of nodes in the tree is in the range [1, 1000].", "-100 <= Node.val <= 100"],
        topics: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
        starterCode: {
          javascript: `function isSymmetric(root) {\n    // Write your code here\n};`,
          python: `class Solution:\n    def isSymmetric(self, root: Optional[TreeNode]) -> bool:\n        # Write your code here\n        pass`,
          java: `class Solution {\n    public boolean isSymmetric(TreeNode root) {\n        // Write your code here\n    }\n}`,
          cpp: `class Solution {\npublic:\n    bool isSymmetric(TreeNode* root) {\n        // Write your code here\n    }\n};`
        },
        testCases: [
          { input: { root: [1, 2, 2, 3, 4, 4, 3] }, expected: true }
        ]
      },
      {
        title: "Path Sum",
        slug: "path-sum",
        difficulty: "Easy",
        order: 12,
        videoId: "Hg82DzMemMI",
        description: `Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.`,
        examples: [
          { input: "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22", output: "true" }
        ],
        constraints: ["The number of nodes in the tree is in the range [0, 5000].", "-1000 <= Node.val <= 1000", "-1000 <= targetSum <= 1000"],
        topics: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
        starterCode: {
          javascript: `function hasPathSum(root, targetSum) {\n    // Write your code here\n};`,
          python: `class Solution:\n    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:\n        # Write your code here\n        pass`,
          java: `class Solution {\n    public boolean hasPathSum(TreeNode root, int targetSum) {\n        // Write your code here\n    }\n}`,
          cpp: `class Solution {\npublic:\n    bool hasPathSum(TreeNode* root, int targetSum) {\n        // Write your code here\n    }\n};`
        },
        testCases: [
          { input: { root: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], targetSum: 22 }, expected: true }
        ]
      }
    ];

    sampleProblems.forEach(problemData => {
      this.createProblem(problemData);
    });
  }

  private initializeContests() {
    const sampleContests: InsertContest[] = [
      {
        title: "Weekly Contest 1",
        description: "Join our first weekly coding contest! Solve 3 problems in 90 minutes.",
        startTime: new Date(Date.now() - 3600000), // Started 1 hour ago
        endTime: new Date(Date.now() + 3600000 * 24), // Ends in 24 hours
        problemIds: ["two-sum", "reverse-linked-list", "jump-game"],
        status: "ongoing"
      },
      {
        title: "Algorithms Cup",
        description: "A high-stakes algorithmic challenge for top developers.",
        startTime: new Date(Date.now() + 3600000 * 48), // Starts in 48 hours
        endTime: new Date(Date.now() + 3600000 * 50),
        problemIds: ["two-sum", "jump-game"],
        status: "upcoming"
      }
    ];

    sampleContests.forEach(contestData => {
      this.createContest(contestData);
    });
  }

  private initializeBadges() {
    const sampleBadges: InsertBadgeSchema[] = [
      { name: "First Solve", description: "Solved your first problem!", image: "🥇", criteria: { type: "solved_count", count: 1 } },
      { name: "Algorithmist", description: "Solved 10 problems.", image: "👨‍💻", criteria: { type: "solved_count", count: 10 } },
      { name: "Daily Streak", description: "Maintained a 7-day streak!", image: "🔥", criteria: { type: "streak_count", count: 7 } }
    ];
    // Cast to Badge type for simplicity in mem storage
    sampleBadges.forEach(badge => {
      const id = randomUUID();
      this.badges.set(id, { ...badge, id } as Badge);
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
      likes: insertProblem.likes || 0,
      dislikes: insertProblem.dislikes || 0,
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

  async getSubmissionsWithDetails(userId: string): Promise<any[]> {
    const submissions = Array.from(this.submissions.values())
      .filter(submission => submission.userId === userId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));

    const problemAttempts = new Map<string, number>();
    
    const detailedSubmissions = submissions.map(submission => {
      const problem = this.problems.get(submission.problemId);
      const attemptNumber = (problemAttempts.get(submission.problemId) || 0) + 1;
      problemAttempts.set(submission.problemId, attemptNumber);
      
      return {
        ...submission,
        problemTitle: problem?.title || "Unknown Problem",
        problemSlug: problem?.slug || "",
        attemptNumber
      };
    });

    return detailedSubmissions.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = randomUUID();
    const submission: Submission = { 
      ...insertSubmission, 
      id,
      passedCount: insertSubmission.passedCount || 0,
      totalCount: insertSubmission.totalCount || 0,
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
    const key = `${userProblem.visitorId}-${userProblem.problemSlug}`; // Fixed to use slug for interaction tracking
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

  async getUserProblemInteraction(visitorId: string, problemSlug: string): Promise<any> {
    const key = `${visitorId}-${problemSlug}`;
    return this.userInteractions.get(key) || { liked: false, disliked: false, starred: false, solved: false };
  }

  async toggleLike(visitorId: string, problemSlug: string): Promise<any> {
    const key = `${visitorId}-${problemSlug}`;
    const current = this.userInteractions.get(key) || { liked: false, disliked: false, starred: false, solved: false };
    const wasLiked = current.liked;
    const wasDisliked = current.disliked;

    current.liked = !wasLiked;
    if (current.liked && wasDisliked) {
      current.disliked = false;
    }
    this.userInteractions.set(key, current);

    const problem = await this.getProblemBySlug(problemSlug);
    if (problem) {
      let likes = problem.likes || 0;
      let dislikes = problem.dislikes || 0;
      
      if (wasLiked) {
        likes = Math.max(0, likes - 1);
      } else {
        likes += 1;
        if (wasDisliked) {
          dislikes = Math.max(0, dislikes - 1);
        }
      }

      const updatedProblem = { ...problem, likes, dislikes };
      this.problems.set(problem.id, updatedProblem);

      return { liked: current.liked, disliked: current.disliked, likes, dislikes };
    }

    return current;
  }

  async toggleDislike(visitorId: string, problemSlug: string): Promise<any> {
    const key = `${visitorId}-${problemSlug}`;
    const current = this.userInteractions.get(key) || { liked: false, disliked: false, starred: false, solved: false };
    const wasLiked = current.liked;
    const wasDisliked = current.disliked;

    current.disliked = !wasDisliked;
    if (current.disliked && wasLiked) {
      current.liked = false;
    }
    this.userInteractions.set(key, current);

    const problem = await this.getProblemBySlug(problemSlug);
    if (problem) {
      let likes = problem.likes || 0;
      let dislikes = problem.dislikes || 0;
      
      if (wasDisliked) {
        dislikes = Math.max(0, dislikes - 1);
      } else {
        dislikes += 1;
        if (wasLiked) {
          likes = Math.max(0, likes - 1);
        }
      }

      const updatedProblem = { ...problem, likes, dislikes };
      this.problems.set(problem.id, updatedProblem);

      return { liked: current.liked, disliked: current.disliked, likes, dislikes };
    }

    return current;
  }

  async toggleStar(visitorId: string, problemSlug: string): Promise<any> {
    const key = `${visitorId}-${problemSlug}`;
    const current = this.userInteractions.get(key) || { liked: false, disliked: false, starred: false, solved: false };
    current.starred = !current.starred;
    this.userInteractions.set(key, current);
    return { starred: current.starred };
  }

  async getAllInteractions(visitorId: string): Promise<any[]> {
    const result: any[] = [];
    const problems = await this.getProblems();
    
    const entries = Array.from(this.userInteractions.entries());
    for (const [key, interaction] of entries) {
      if (key.startsWith(`${visitorId}-`)) {
        const problemSlug = key.replace(`${visitorId}-`, '');
        const problem = problems.find(p => p.slug === problemSlug);
        if (problem && (interaction.liked || interaction.disliked || interaction.starred)) {
          result.push({
            problemSlug,
            problemTitle: problem.title,
            difficulty: problem.difficulty,
            ...interaction
          });
        }
      }
    }
    
    return result;
  }

  // Contest methods
  async getContests(): Promise<Contest[]> {
    return Array.from(this.contests.values());
  }

  async getContest(id: string): Promise<Contest | undefined> {
    return this.contests.get(id);
  }

  async createContest(insertContest: InsertContest): Promise<Contest> {
    const id = randomUUID();
    const contest: Contest = { 
      ...insertContest, 
      id,
      problemIds: insertContest.problemIds || [],
      status: insertContest.status || "upcoming",
      createdAt: new Date()
    };
    this.contests.set(id, contest);
    return contest;
  }

  async getContestParticipants(contestId: string): Promise<ContestParticipant[]> {
    return Array.from(this.contestParticipants.values()).filter(p => p.contestId === contestId);
  }

  async joinContest(participant: InsertContestParticipant): Promise<ContestParticipant> {
    const id = randomUUID();
    const cp: ContestParticipant = {
      ...participant,
      id,
      score: 0,
      rank: null,
      submissions: [],
      joinedAt: new Date(),
      blockchainHash: null
    };
    this.contestParticipants.set(id, cp);
    return cp;
  }

  async updateContestParticipant(contestId: string, userId: string, updates: Partial<ContestParticipant>): Promise<ContestParticipant> {
    const participant = Array.from(this.contestParticipants.values()).find(p => p.contestId === contestId && p.userId === userId);
    if (!participant) throw new Error("Participant not found");
    const updated = { ...participant, ...updates };
    this.contestParticipants.set(participant.id, updated);
    return updated;
  }

  // Gamification & Streaks
  async getUserStreak(userId: string): Promise<UserStreak | undefined> {
    return this.userStreaks.get(userId);
  }

  async updateUserStreak(userId: string): Promise<UserStreak> {
    const current = this.userStreaks.get(userId) || { id: randomUUID(), userId, currentStreak: 0, longestStreak: 0, lastSubmissionAt: null };
    const now = new Date();
    const lastAt = current.lastSubmissionAt;

    if (!lastAt) {
      current.currentStreak = 1;
    } else {
      const diff = now.getTime() - lastAt.getTime();
      const diffDays = diff / (1000 * 3600 * 24);
      if (diffDays < 1) {
        // Same day, do nothing
      } else if (diffDays < 2) {
        current.currentStreak += 1;
      } else {
        current.currentStreak = 1;
      }
    }
    current.lastSubmissionAt = now;
    if (current.currentStreak > current.longestStreak) current.longestStreak = current.currentStreak;
    this.userStreaks.set(userId, current);
    return current;
  }

  async getBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return Array.from(this.userBadges.values()).filter(b => b.userId === userId);
  }

  async awardBadge(userId: string, badgeId: string): Promise<UserBadge> {
    const id = randomUUID();
    const ub: UserBadge = { id, userId, badgeId, earnedAt: new Date() };
    this.userBadges.set(id, ub);
    return ub;
  }

  async getRewardPoints(userId: string): Promise<RewardPoint | undefined> {
    return this.rewardPoints.get(userId);
  }

  async addRewardPoints(userId: string, points: number): Promise<RewardPoint> {
    const current = this.rewardPoints.get(userId) || { id: randomUUID(), userId, points: 0, updatedAt: new Date() };
    current.points += points;
    current.updatedAt = new Date();
    this.rewardPoints.set(userId, current);
    return current;
  }
}

export const storage = new MemStorage();

