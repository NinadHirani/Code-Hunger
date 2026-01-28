import { type User, type InsertUser, type Problem, type InsertProblem, type Submission, type InsertSubmission, type UserProblem, type InsertUserProblem, type Contest, type InsertContest, type ContestParticipant, type InsertContestParticipant, type Badge, type UserBadge, type UserStreak, type RewardPoint, type College, type LearningPath, type UserLearningPath, type JobSimulation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
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

  // Colleges
  getColleges(): Promise<College[]>;
  getCollege(id: string): Promise<College | undefined>;
  getCollegeBySlug(slug: string): Promise<College | undefined>;
  createCollege(college: any): Promise<College>;

  // Learning Paths
  getLearningPaths(): Promise<LearningPath[]>;
  getLearningPath(id: string): Promise<LearningPath | undefined>;
  createLearningPath(path: any): Promise<LearningPath>;
  getUserLearningPaths(userId: string): Promise<UserLearningPath[]>;
  updateUserLearningPath(userId: string, pathId: string, updates: Partial<UserLearningPath>): Promise<UserLearningPath>;

  // Job Simulations
  getJobSimulations(): Promise<JobSimulation[]>;
  getJobSimulation(id: string): Promise<JobSimulation | undefined>;
  createJobSimulation(simulation: any): Promise<JobSimulation>;
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
  private colleges: Map<string, College>;
  private learningPaths: Map<string, LearningPath>;
  private userLearningPaths: Map<string, UserLearningPath>;
  private jobSimulations: Map<string, JobSimulation>;

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
    this.colleges = new Map();
    this.learningPaths = new Map();
    this.userLearningPaths = new Map();
    this.jobSimulations = new Map();
    
    // Initialize with sample data
    this.initializeProblems();
    this.initializeContests();
    this.initializeBadges();
    this.initializeNewFeatures();
  }

  private initializeNewFeatures() {
    // Learning Paths
    const paths = [
      { id: "1", title: "Data Structures Mastery", description: "Master the fundamentals of DSA.", image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop", problems: [{ problemId: "two-sum", order: 1 }, { problemId: "reverse-linked-list", order: 2 }] },
      { id: "2", title: "Algorithm Design", description: "Learn advanced algorithm techniques.", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop", problems: [{ problemId: "jump-game", order: 1 }] }
    ];
    paths.forEach(p => this.learningPaths.set(p.id, p as any));

    // Job Simulations
    const sims = [
      { id: "1", companyName: "Google", role: "Software Engineer", description: "Experience a mock interview at Google.", problemIds: ["two-sum", "jump-game"], duration: 90, logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" },
      { id: "2", companyName: "Meta", role: "Frontend Developer", description: "Frontend focused interview simulation.", problemIds: ["reverse-linked-list"], duration: 60, logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" }
    ];
    sims.forEach(s => this.jobSimulations.set(s.id, s as any));

    // Colleges
    const clgs = [
      { id: "1", name: "MIT", slug: "mit", domain: "mit.edu", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg" },
      { id: "2", name: "Stanford", slug: "stanford", domain: "stanford.edu", logo: "https://upload.wikimedia.org/wikipedia/en/b/b7/Stanford_University_seal_2003.svg" }
    ];
    clgs.forEach(c => this.colleges.set(c.id, c as any));
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
        },
        {
          title: "Search a 2D Matrix",
          slug: "search-a-2d-matrix",
          difficulty: "Medium",
          order: 13,
          videoId: "ZfFl4torNg4",
          description: `Write an efficient algorithm that searches for a value target in an m x n integer matrix matrix. This matrix has the following properties:
  - Integers in each row are sorted from left to right.
  - The first integer of each row is greater than the last integer of the previous row.`,
          examples: [
            { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", output: "true" }
          ],
          constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 100", "-10^4 <= matrix[i][j], target <= 10^4"],
          topics: ["Array", "Binary Search", "Matrix"],
          starterCode: {
            javascript: `function searchMatrix(matrix, target) {\n    // Write your code here\n};`,
            python: `class Solution:\n    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:\n        # Write your code here\n        pass`,
            java: `class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        // Write your code here\n    }\n}`,
            cpp: `class Solution {\npublic:\n    bool searchMatrix(vector<vector<int>>& matrix, int target) {\n        // Write your code here\n    }\n};`
          },
          testCases: [
            { input: { matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target: 3 }, expected: true }
          ]
        },
        {
          title: "Container With Most Water",
          slug: "container-with-most-water",
          difficulty: "Medium",
          order: 14,
          videoId: "UuiTKBwPgFY",
          description: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).
  Find two lines that together with the x-axis form a container, such that the container contains the most water.
  Return the maximum amount of water a container can store.`,
          examples: [
            { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" }
          ],
          constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
          topics: ["Array", "Two Pointers", "Greedy"],
          starterCode: {
            javascript: `function maxArea(height) {\n    // Write your code here\n};`,
            python: `class Solution:\n    def maxArea(self, height: List[int]) -> int:\n        # Write your code here\n        pass`,
            java: `class Solution {\n    public int maxArea(int[] height) {\n        // Write your code here\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        // Write your code here\n    }\n};`
          },
          testCases: [
            { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expected: 49 }
          ]
        },
        {
          title: "Merge Intervals",
          slug: "merge-intervals",
          difficulty: "Medium",
          order: 15,
          videoId: "44H3cEC2fyg",
          description: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
          examples: [
            { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" }
          ],
          constraints: ["1 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= starti <= endi <= 10^4"],
          topics: ["Array", "Sorting"],
          starterCode: {
            javascript: `function merge(intervals) {\n    // Write your code here\n};`,
            python: `class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        # Write your code here\n        pass`,
            java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your code here\n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your code here\n    }\n};`
          },
          testCases: [
            { input: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }, expected: [[1, 6], [8, 10], [15, 18]] }
          ]
        },
        {
          title: "Maximum Depth of Binary Tree",
          slug: "maximum-depth-of-binary-tree",
          difficulty: "Easy",
          order: 16,
          videoId: "hTM3phVI6YQ",
          description: `Given the root of a binary tree, return its maximum depth.
  A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
          examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "3" }
          ],
          constraints: ["The number of nodes in the tree is in the range [0, 10^4].", "-100 <= Node.val <= 100"],
          topics: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
          starterCode: {
            javascript: `function maxDepth(root) {\n    // Write your code here\n};`,
            python: `class Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        # Write your code here\n        pass`,
            java: `class Solution {\n    public int maxDepth(TreeNode root) {\n        // Write your code here\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        // Write your code here\n    }\n};`
          },
          testCases: [
            { input: { root: [3, 9, 20, null, null, 15, 7] }, expected: 3 }
          ]
        },
        {
          title: "Best Time to Buy and Sell Stock",
          slug: "best-time-to-buy-and-sell-stock",
          difficulty: "Easy",
          order: 17,
          videoId: "1pkOgXD63yU",
          description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.
  You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.
  Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
          examples: [
            { input: "prices = [7,1,5,3,6,4]", output: "5" }
          ],
          constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
          topics: ["Array", "Dynamic Programming"],
          starterCode: {
            javascript: `function maxProfit(prices) {\n    // Write your code here\n};`,
            python: `class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        # Write your code here\n        pass`,
            java: `class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your code here\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your code here\n    }\n};`
          },
          testCases: [
            { input: { prices: [7, 1, 5, 3, 6, 4] }, expected: 5 }
          ]
        },
        {
          title: "Subsets",
          slug: "subsets",
          difficulty: "Medium",
          order: 18,
          videoId: "REOH22XQk1c",
          description: `Given an integer array nums of unique elements, return all possible subsets (the power set).
  The solution set must not contain duplicate subsets. Return the solution in any order.`,
          examples: [
            { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" }
          ],
          constraints: ["1 <= nums.length <= 10", "-10 <= nums[i] <= 10", "All the numbers of nums are unique."],
          topics: ["Array", "Backtracking", "Bit Manipulation"],
          starterCode: {
            javascript: `function subsets(nums) {\n    // Write your code here\n};`,
            python: `class Solution:\n    def subsets(self, nums: List[int]) -> List[List[int]]:\n        # Write your code here\n        pass`,
            java: `class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        // Write your code here\n    }\n}`,
            cpp: `class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        // Write your code here\n    }\n};`
          },
          testCases: [
            { input: { nums: [1, 2, 3] }, expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] }
          ]
        },
        {
          title: "Longest Common Prefix",
          slug: "longest-common-prefix",
          difficulty: "Easy",
          order: 19,
          videoId: "0sWShKIJoo4",
          description: `Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".`,
          examples: [
            { input: 'strs = ["flower","flow","flight"]', output: '"fl"' }
          ],
          constraints: ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200", "strs[i] consists of only lowercase English letters."],
          topics: ["String", "Trie"],
          starterCode: {
            javascript: `function longestCommonPrefix(strs) {\n    // Write your code here\n};`,
            python: `class Solution:\n    def longestCommonPrefix(self, strs: List[str]) -> str:\n        # Write your code here\n        pass`,
            java: `class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        // Write your code here\n    }\n}`,
            cpp: `class Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        // Write your code here\n    }\n};`
          },
          testCases: [
            { input: { strs: ["flower", "flow", "flight"] }, expected: "fl" }
          ]
        },
        {
          title: "Single Number",
          slug: "single-number",
          difficulty: "Easy",
          order: 20,
          videoId: "qWPNUv-oAnQ",
          description: `Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.
  You must implement a solution with a linear runtime complexity and use only constant extra space.`,
          examples: [
            { input: "nums = [2,2,1]", output: "1" }
          ],
          constraints: ["1 <= nums.length <= 3 * 10^4", "-3 * 10^4 <= nums[i] <= 3 * 10^4", "Each element in the array appears twice except for one element which appears only once."],
          topics: ["Array", "Bit Manipulation"],
          starterCode: {
            javascript: `function singleNumber(nums) {\n    // Write your code here\n};`,
            python: `class Solution:\n    def singleNumber(self, nums: List[int]) -> int:\n        # Write your code here\n        pass`,
            java: `class Solution {\n    public int singleNumber(int[] nums) {\n        // Write your code here\n    }\n}`,
            cpp: `class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        // Write your code here\n    }\n};`
          },
          testCases: [
            { input: { nums: [2, 2, 1] }, expected: 1 }
          ]
        },
        {
          title: "Valid Anagram",
          slug: "valid-anagram",
          difficulty: "Easy",
          order: 21,
          videoId: "g8T63iV1E4I",
          description: `Given two strings s and t, return true if t is an anagram of s, and false otherwise.
  An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
          examples: [
            { input: 's = "anagram", t = "nagaram"', output: "true" }
          ],
          constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
          topics: ["Hash Table", "String", "Sorting"],
          starterCode: {
            javascript: `function isAnagram(s, t) {\n    // Write your code here\n};`,
            python: `class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # Write your code here\n        pass`,
            java: `class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your code here\n    }\n}`,
            cpp: `class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        // Write your code here\n    }\n};`
          },
          testCases: [
            { input: { s: "anagram", t: "nagaram" }, expected: true }
          ]
        },
          {
            title: "Min Stack",
            slug: "min-stack",
            difficulty: "Medium",
            order: 22,
            videoId: "qkLl7nugYaw",
            description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.
    Implement the MinStack class:
    - MinStack() initializes the stack object.
    - void push(int val) pushes the element val onto the stack.
    - void pop() removes the element on the top of the stack.
    - int top() gets the top element of the stack.
    - int getMin() retrieves the minimum element in the stack.`,
            examples: [
              { input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]', output: '[null,null,null,null,-3,null,0,-2]' }
            ],
            constraints: ["-2^31 <= val <= 2^31 - 1", "Methods pop, top and getMin operations will always be called on non-empty stacks.", "At most 3 * 10^4 calls will be made to push, pop, top, and getMin."],
            topics: ["Stack", "Design"],
            starterCode: {
              javascript: `var MinStack = function() {\n    // Initialize your stack here\n};\n\nMinStack.prototype.push = function(val) {\n    // Write your code here\n};\n\nMinStack.prototype.pop = function() {\n    // Write your code here\n};\n\nMinStack.prototype.top = function() {\n    // Write your code here\n};\n\nMinStack.prototype.getMin = function() {\n    // Write your code here\n};`,
              python: `class MinStack:\n    def __init__(self):\n        # Initialize your stack here\n        pass\n\n    def push(self, val: int) -> None:\n        # Write your code here\n        pass\n\n    def pop(self) -> None:\n        # Write your code here\n        pass\n\n    def top(self) -> int:\n        # Write your code here\n        pass\n\n    def getMin(self) -> int:\n        # Write your code here\n        pass`,
              java: `class MinStack {\n    public MinStack() {\n        // Initialize your stack here\n    }\n    \n    public void push(int val) {\n        // Write your code here\n    }\n    \n    public void pop() {\n        // Write your code here\n    }\n    \n    public int top() {\n        // Write your code here\n    }\n    \n    public int getMin() {\n        // Write your code here\n    }\n}`,
              cpp: `class MinStack {\npublic:\n    MinStack() {\n        // Initialize your stack here\n    }\n    \n    void push(int val) {\n        // Write your code here\n    }\n    \n    void pop() {\n        // Write your code here\n    }\n    \n    int top() {\n        // Write your code here\n    }\n    \n    int getMin() {\n        // Write your code here\n    }\n};`
            },
            testCases: [
              { input: { operations: ["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"], values: [[], [-2], [0], [-3], [], [], [], []] }, expected: [null, null, null, null, -3, null, 0, -2] }
            ]
          },
          {
            title: "Longest Palindromic Substring",
            slug: "longest-palindromic-substring",
            difficulty: "Medium",
            order: 23,
            videoId: "XYQEc14igLI",
            description: "Given a string s, return the longest palindromic substring in s.",
            examples: [
              { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' }
            ],
            constraints: ["1 <= s.length <= 1000", "s consists of only digits and English letters."],
            topics: ["String", "Dynamic Programming"],
            starterCode: {
              javascript: `function longestPalindrome(s) {\n    // Write your code here\n};`,
              python: `class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        # Write your code here\n        pass`,
              java: `class Solution {\n    public String longestPalindrome(String s) {\n        // Write your code here\n    }\n}`,
              cpp: `class Solution {\npublic:\n    string longestPalindrome(string s) {\n        // Write your code here\n    }\n};`
            },
            testCases: [
              { input: { s: "babad" }, expected: "bab" },
              { input: { s: "cbbd" }, expected: "bb" }
            ]
          },
          {
            title: "3Sum",
            slug: "3sum",
            difficulty: "Medium",
            order: 24,
            videoId: "jzZgF8n2vRE",
            description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
            examples: [
              { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }
            ],
            constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
            topics: ["Array", "Two Pointers", "Sorting"],
            starterCode: {
              javascript: `function threeSum(nums) {\n    // Write your code here\n};`,
              python: `class Solution:\n    def threeSum(self, nums: List[int]) -> List[List[int]]:\n        # Write your code here\n        pass`,
              java: `class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Write your code here\n    }\n}`,
              cpp: `class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        // Write your code here\n    }\n};`
            },
            testCases: [
              { input: { nums: [-1, 0, 1, 2, -1, -4] }, expected: [[-1, -1, 2], [-1, 0, 1]] }
            ]
          },
          {
            title: "Rotate Image",
            slug: "rotate-image",
            difficulty: "Medium",
            order: 25,
            videoId: "fMSJSS7eO1w",
            description: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).",
            examples: [
              { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]" }
            ],
            constraints: ["n == matrix.length == matrix[i].length", "1 <= n <= 20", "-1000 <= matrix[i][j] <= 1000"],
            topics: ["Array", "Math", "Matrix"],
            starterCode: {
              javascript: `function rotate(matrix) {\n    // Write your code here\n};`,
              python: `class Solution:\n    def rotate(self, matrix: List[List[int]]) -> None:\n        # Write your code here\n        pass`,
              java: `class Solution {\n    public void rotate(int[][] matrix) {\n        // Write your code here\n    }\n}`,
              cpp: `class Solution {\npublic:\n    void rotate(vector<vector<int>>& matrix) {\n        // Write your code here\n    }\n};`
            },
            testCases: [
              { input: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }, expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] }
            ]
          },
          {
            title: "Group Anagrams",
            slug: "group-anagrams",
            difficulty: "Medium",
            order: 26,
            videoId: "vzdNOK2oB2E",
            description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
            examples: [
              { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }
            ],
            constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
            topics: ["Array", "Hash Table", "String", "Sorting"],
            starterCode: {
              javascript: `function groupAnagrams(strs) {\n    // Write your code here\n};`,
              python: `class Solution:\n    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:\n        # Write your code here\n        pass`,
              java: `class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Write your code here\n    }\n}`,
              cpp: `class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        // Write your code here\n    }\n};`
            },
            testCases: [
              { input: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] }, expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]] }
            ]
          },
          {
            title: "Spiral Matrix",
            slug: "spiral-matrix",
            difficulty: "Medium",
            order: 27,
            videoId: "BJnMZNwUk1M",
            description: "Given an m x n matrix, return all elements of the matrix in spiral order.",
            examples: [
              { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" }
            ],
            constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 10", "-100 <= matrix[i][j] <= 100"],
            topics: ["Array", "Matrix", "Simulation"],
            starterCode: {
              javascript: `function spiralOrder(matrix) {\n    // Write your code here\n};`,
              python: `class Solution:\n    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:\n        # Write your code here\n        pass`,
              java: `class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        // Write your code here\n    }\n}`,
              cpp: `class Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        // Write your code here\n    }\n};`
            },
            testCases: [
              { input: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }, expected: [1, 2, 3, 6, 9, 8, 7, 4, 5] }
            ]
          },
          {
            title: "Word Search",
            slug: "word-search",
            difficulty: "Medium",
            order: 28,
            videoId: "pfiQ_PS1g8E",
            description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
            examples: [
              { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: "true" }
            ],
            constraints: ["m == board.length", "n = board[i].length", "1 <= m, n <= 6", "1 <= word.length <= 15"],
            topics: ["Array", "Backtracking", "Matrix"],
            starterCode: {
              javascript: `function exist(board, word) {\n    // Write your code here\n};`,
              python: `class Solution:\n    def exist(self, board: List[List[str]], word: str) -> bool:\n        # Write your code here\n        pass`,
              java: `class Solution {\n    public boolean exist(char[][] board, String word) {\n        // Write your code here\n    }\n}`,
              cpp: `class Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        // Write your code here\n    }\n};`
            },
            testCases: [
              { input: { board: [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], word: "ABCCED" }, expected: true }
            ]
          },
          {
            title: "Decode Ways",
            slug: "decode-ways",
            difficulty: "Medium",
            order: 29,
            videoId: "FEkZxCl_-ik",
            description: "A message containing letters from A-Z can be encoded into numbers using 'A' -> '1', 'B' -> '2', ..., 'Z' -> '26'. Given a string s containing only digits, return the number of ways to decode it.",
            examples: [
              { input: 's = "12"', output: "2", explanation: '"12" could be decoded as "AB" (1 2) or "L" (12).' }
            ],
            constraints: ["1 <= s.length <= 100", "s contains only digits and may contain leading zero(s)."],
            topics: ["String", "Dynamic Programming"],
            starterCode: {
              javascript: `function numDecodings(s) {\n    // Write your code here\n};`,
              python: `class Solution:\n    def numDecodings(self, s: str) -> int:\n        # Write your code here\n        pass`,
              java: `class Solution {\n    public int numDecodings(String s) {\n        // Write your code here\n    }\n}`,
              cpp: `class Solution {\npublic:\n    int numDecodings(string s) {\n        // Write your code here\n    }\n};`
            },
            testCases: [
              { input: { s: "12" }, expected: 2 },
              { input: { s: "226" }, expected: 3 }
            ]
          },
          {
            title: "Binary Tree Level Order Traversal",
            slug: "binary-tree-level-order-traversal",
            difficulty: "Medium",
            order: 30,
            videoId: "6ZnyEApgFYg",
            description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
            examples: [
              { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }
            ],
            constraints: ["The number of nodes in the tree is in the range [0, 2000].", "-1000 <= Node.val <= 1000"],
            topics: ["Tree", "Breadth-First Search", "Binary Tree"],
            starterCode: {
              javascript: `function levelOrder(root) {\n    // Write your code here\n};`,
              python: `class Solution:\n    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:\n        # Write your code here\n        pass`,
              java: `class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Write your code here\n    }\n}`,
              cpp: `class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        // Write your code here\n    }\n};`
            },
            testCases: [
              { input: { root: [3, 9, 20, null, null, 15, 7] }, expected: [[3], [9, 20], [15, 7]] }
            ]
          },
          {
            title: "Validate Binary Search Tree",
            slug: "validate-binary-search-tree",
            difficulty: "Medium",
            order: 31,
            videoId: "s6ATEkipzow",
            description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
            examples: [
              { input: "root = [2,1,3]", output: "true" }
            ],
            constraints: ["The number of nodes in the tree is in the range [1, 10^4].", "-2^31 <= Node.val <= 2^31 - 1"],
            topics: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"],
            starterCode: {
              javascript: `function isValidBST(root) {\n    // Write your code here\n};`,
              python: `class Solution:\n    def isValidBST(self, root: Optional[TreeNode]) -> bool:\n        # Write your code here\n        pass`,
              java: `class Solution {\n    public boolean isValidBST(TreeNode root) {\n        // Write your code here\n    }\n}`,
              cpp: `class Solution {\npublic:\n    bool isValidBST(TreeNode* root) {\n        // Write your code here\n    }\n};`
            },
            testCases: [
              { input: { root: [2, 1, 3] }, expected: true }
            ]
          },
          {
            title: "Lowest Common Ancestor of a Binary Tree",
            slug: "lowest-common-ancestor-of-a-binary-tree",
            difficulty: "Medium",
            order: 32,
            videoId: "13m9ZCB8gjw",
            description: "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.",
            examples: [
              { input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1", output: "3" }
            ],
            constraints: ["The number of nodes in the tree is in the range [2, 10^5].", "-10^9 <= Node.val <= 10^9", "All Node.val are unique.", "p != q", "p and q will exist in the tree."],
            topics: ["Tree", "Depth-First Search", "Binary Tree"],
            starterCode: {
              javascript: `function lowestCommonAncestor(root, p, q) {\n    // Write your code here\n};`,
              python: `class Solution:\n    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':\n        # Write your code here\n        pass`,
              java: `class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        // Write your code here\n    }\n}`,
              cpp: `class Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        // Write your code here\n    }\n};`
            },
            testCases: [
              { input: { root: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 5, q: 1 }, expected: 3 }
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

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async getColleges(): Promise<College[]> {
    return Array.from(this.colleges.values());
  }

  async getCollege(id: string): Promise<College | undefined> {
    return this.colleges.get(id);
  }

  async getCollegeBySlug(slug: string): Promise<College | undefined> {
    return Array.from(this.colleges.values()).find(c => c.slug === slug);
  }

  async createCollege(college: any): Promise<College> {
    const id = randomUUID();
    const c = { ...college, id, createdAt: new Date() };
    this.colleges.set(id, c);
    return c;
  }

  async getLearningPaths(): Promise<LearningPath[]> {
    return Array.from(this.learningPaths.values());
  }

  async getLearningPath(id: string): Promise<LearningPath | undefined> {
    return this.learningPaths.get(id);
  }

  async createLearningPath(path: any): Promise<LearningPath> {
    const id = randomUUID();
    const p = { ...path, id, createdAt: new Date() };
    this.learningPaths.set(id, p);
    return p;
  }

  async getUserLearningPaths(userId: string): Promise<UserLearningPath[]> {
    return Array.from(this.userLearningPaths.values()).filter(p => p.userId === userId);
  }

  async updateUserLearningPath(userId: string, pathId: string, updates: Partial<UserLearningPath>): Promise<UserLearningPath> {
    const key = `${userId}-${pathId}`;
    const existing = Array.from(this.userLearningPaths.values()).find(p => p.userId === userId && p.pathId === pathId);
    if (!existing) {
      const id = randomUUID();
      const p = { id, userId, pathId, progress: 0, completed: false, lastActivity: new Date(), ...updates };
      this.userLearningPaths.set(id, p);
      return p;
    }
    const updated = { ...existing, ...updates, lastActivity: new Date() };
    this.userLearningPaths.set(existing.id, updated);
    return updated;
  }

  async getJobSimulations(): Promise<JobSimulation[]> {
    return Array.from(this.jobSimulations.values());
  }

  async getJobSimulation(id: string): Promise<JobSimulation | undefined> {
    return this.jobSimulations.get(id);
  }

  async createJobSimulation(simulation: any): Promise<JobSimulation> {
    const id = randomUUID();
    const s = { ...simulation, id, createdAt: new Date() };
    this.jobSimulations.set(id, s);
    return s;
  }
}

export const storage = new MemStorage();

