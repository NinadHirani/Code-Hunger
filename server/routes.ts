import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubmissionSchema, insertUserProblemSchema, insertContestSchema, insertContestParticipantSchema } from "@shared/schema";
import { z } from "zod";
import { createHash } from "crypto";

const PISTON_API = "https://emkc.org/api/v2/piston";

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "cpp", version: "10.2.0" },
};

// Simple mock for blockchain hashing
function secureResult(data: any) {
  return createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

const JS_HELPERS = `
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
  let count = 0;
  while (current !== null && count < 10000) {
    result.push(current.val);
    current = current.next;
    count++;
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

const PYTHON_HELPERS = `
import json
import sys
from typing import *

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
`;

const JAVA_HELPERS = `
import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Helper {
    static ListNode arrayToLinkedList(int[] arr) {
        if (arr == null || arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode current = head;
        for (int i = 1; i < arr.length; i++) {
            current.next = new ListNode(arr[i]);
            current = current.next;
        }
        return head;
    }
    
    static String linkedListToString(ListNode head) {
        StringBuilder sb = new StringBuilder("[");
        ListNode current = head;
        int count = 0;
        while (current != null && count < 10000) {
            if (count > 0) sb.append(",");
            sb.append(current.val);
            current = current.next;
            count++;
        }
        sb.append("]");
        return sb.toString();
    }
    
    static String arrayToString(int[] arr) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(arr[i]);
        }
        sb.append("]");
        return sb.toString();
    }
    
    static String arrayToString(String[] arr) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) sb.append(",");
            sb.append("\\"").append(arr[i]).append("\\"");
        }
        sb.append("]");
        return sb.toString();
    }
    
    static String boolToString(boolean b) {
        return b ? "true" : "false";
    }
}
`;

const CPP_HELPERS = `
#include <iostream>
#include <vector>
#include <string>
#include <queue>
#include <sstream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

ListNode* arrayToLinkedList(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* current = head;
    for (int i = 1; i < arr.size(); i++) {
        current->next = new ListNode(arr[i]);
        current = current->next;
    }
    return head;
}

string linkedListToString(ListNode* head) {
    string result = "[";
    ListNode* current = head;
    int count = 0;
    while (current != nullptr && count < 10000) {
        if (count > 0) result += ",";
        result += to_string(current->val);
        current = current->next;
        count++;
    }
    result += "]";
    return result;
}

template<typename T>
string vectorToString(vector<T>& arr) {
    string result = "[";
    for (int i = 0; i < arr.size(); i++) {
        if (i > 0) result += ",";
        result += to_string(arr[i]);
    }
    result += "]";
    return result;
}

string vectorToString(vector<string>& arr) {
    string result = "[";
    for (int i = 0; i < arr.size(); i++) {
        if (i > 0) result += ",";
        result += "\\"" + arr[i] + "\\"";
    }
    result += "]";
    return result;
}

string boolToString(bool b) {
    return b ? "true" : "false";
}
`;

function detectProblemType(slug: string): "linkedlist" | "tree" | "array" | "string" | "other" {
  const linkedListProblems = ['reverse-linked-list', 'merge-two-sorted-lists', 'linked-list-cycle', 'remove-nth-node-from-end-of-list'];
  const treeProblems = ['maximum-depth-of-binary-tree', 'invert-binary-tree', 'same-tree', 'symmetric-tree', 'binary-tree-level-order-traversal'];
  
  if (linkedListProblems.includes(slug)) return "linkedlist";
  if (treeProblems.includes(slug)) return "tree";
  return "other";
}

function generateTestWrapper(
  language: string, 
  userCode: string, 
  testCase: any, 
  problemType: string,
  functionName: string
): string {
  const inputJson = JSON.stringify(testCase.input);
  
  if (language === "javascript") {
    let argConversions = "";
    let resultConversion = "result";
    
    if (problemType === "linkedlist") {
      argConversions = `
        const convertedArgs = Object.entries(input).map(([key, val]) => {
          if (key === 'head' || key === 'l1' || key === 'l2' || key === 'list1' || key === 'list2') {
            return arrayToLinkedList(val);
          }
          return val;
        });
      `;
      resultConversion = "linkedListToArray(result)";
    } else if (problemType === "tree") {
      argConversions = `
        const convertedArgs = Object.entries(input).map(([key, val]) => {
          if (key === 'root' || key === 'p' || key === 'q' || key === 'tree1' || key === 'tree2') {
            return arrayToTree(val);
          }
          return val;
        });
      `;
      resultConversion = "(typeof result === 'number' || typeof result === 'boolean') ? result : treeToArray(result)";
    } else {
      argConversions = "const convertedArgs = Object.values(input);";
    }
    
    return `
${JS_HELPERS}
${userCode}

const input = ${inputJson};
${argConversions}
const result = ${functionName}(...convertedArgs);
console.log(JSON.stringify(${resultConversion}));
`;
  }
  
  if (language === "python") {
    let argConversions = "";
    let resultConversion = "result";
    
    if (problemType === "linkedlist") {
      argConversions = `
args = []
for key, val in input.items():
    if key in ['head', 'l1', 'l2', 'list1', 'list2']:
        args.append(array_to_linked_list(val))
    else:
        args.append(val)
`;
      resultConversion = "linked_list_to_array(result)";
    } else if (problemType === "tree") {
      argConversions = `
args = []
for key, val in input.items():
    if key in ['root', 'p', 'q', 'tree1', 'tree2']:
        args.append(array_to_tree(val))
    else:
        args.append(val)
`;
      resultConversion = "result if isinstance(result, (int, bool, float)) else tree_to_array(result)";
    } else {
      argConversions = "args = list(input.values())";
    }
    
    return `
${PYTHON_HELPERS}

${userCode}

input = ${inputJson.replace(/null/g, 'None').replace(/true/g, 'True').replace(/false/g, 'False')}
${argConversions}

if 'Solution' in globals():
    result = Solution().${functionName}(*args)
else:
    result = ${functionName}(*args)

output = ${resultConversion}
if isinstance(output, bool):
    print(json.dumps(output))
else:
    print(json.dumps(output))
`;
  }
  
  if (language === "java") {
    const inputs = testCase.input;
    let mainCode = "";
    
    if (problemType === "linkedlist" && inputs.head) {
      const arr = JSON.stringify(inputs.head);
      mainCode = `
        int[] arr = new int[]{${inputs.head.join(',')}};
        ListNode head = Helper.arrayToLinkedList(arr);
        Solution sol = new Solution();
        ListNode result = sol.reverseList(head);
        System.out.println(Helper.linkedListToString(result));
      `;
    } else {
      const firstKey = Object.keys(inputs)[0];
      const firstVal = inputs[firstKey];
      if (Array.isArray(firstVal) && typeof firstVal[0] === 'number') {
        mainCode = `
        int[] input = new int[]{${firstVal.join(',')}};
        Solution sol = new Solution();
        var result = sol.${functionName}(input);
        if (result instanceof int[]) {
          System.out.println(Helper.arrayToString((int[])result));
        } else if (result instanceof Boolean) {
          System.out.println(Helper.boolToString((Boolean)result));
        } else {
          System.out.println(result);
        }
        `;
      } else if (Array.isArray(firstVal)) {
        mainCode = `
        Solution sol = new Solution();
        var result = sol.${functionName}(new String[]{${firstVal.map(s => `"${s}"`).join(',')}});
        System.out.println(result);
        `;
      } else {
        mainCode = `
        Solution sol = new Solution();
        var result = sol.${functionName}(${JSON.stringify(firstVal)});
        System.out.println(result);
        `;
      }
    }
    
    return `
${JAVA_HELPERS}

${userCode}

public class Main {
    public static void main(String[] args) {
        ${mainCode}
    }
}
`;
  }
  
  if (language === "cpp") {
    const inputs = testCase.input;
    let mainCode = "";
    
    if (problemType === "linkedlist" && inputs.head) {
      mainCode = `
    vector<int> arr = {${inputs.head.join(',')}};
    ListNode* head = arrayToLinkedList(arr);
    Solution sol;
    ListNode* result = sol.reverseList(head);
    cout << linkedListToString(result) << endl;
      `;
    } else {
      const firstKey = Object.keys(inputs)[0];
      const firstVal = inputs[firstKey];
      if (Array.isArray(firstVal) && typeof firstVal[0] === 'number') {
        mainCode = `
    vector<int> input = {${firstVal.join(',')}};
    Solution sol;
    auto result = sol.${functionName}(input);
    cout << vectorToString(result) << endl;
        `;
      } else {
        mainCode = `
    Solution sol;
    auto result = sol.${functionName}(${JSON.stringify(firstVal)});
    cout << result << endl;
        `;
      }
    }
    
    return `
${CPP_HELPERS}

${userCode}

int main() {
    ${mainCode}
    return 0;
}
`;
  }
  
  return userCode;
}

function extractFunctionName(code: string, language: string): string {
  if (language === "javascript") {
    const match = code.match(/function\s+(\w+)\s*\(/);
    return match ? match[1] : "solution";
  }
  if (language === "python") {
    const match = code.match(/def\s+(\w+)\s*\(/);
    return match ? match[1] : "solution";
  }
  if (language === "java") {
    const match = code.match(/public\s+\w+\s+(\w+)\s*\(/);
    return match ? match[1] : "solution";
  }
  if (language === "cpp") {
    const match = code.match(/(\w+)\s*\([^)]*\)\s*\{/);
    return match ? match[1] : "solution";
  }
  return "solution";
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/execute", async (req, res) => {
    try {
      const { language, code, testCases, problemSlug } = req.body;
      
      if (!LANGUAGE_MAP[language]) {
        return res.status(400).json({ error: "Unsupported language" });
      }
      
      const problemType = detectProblemType(problemSlug || "");
      const functionName = extractFunctionName(code, language);
      const langConfig = LANGUAGE_MAP[language];
      const results: any[] = [];
      
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const wrappedCode = generateTestWrapper(language, code, testCase, problemType, functionName);
        
        try {
          const response = await fetch(`${PISTON_API}/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              language: langConfig.language,
              version: langConfig.version,
              files: [{ name: language === "java" ? "Main.java" : `main.${language === "cpp" ? "cpp" : language === "python" ? "py" : "js"}`, content: wrappedCode }],
            }),
          });
          
          const pistonResult = await response.json();
          
          if (pistonResult.run?.stderr) {
            results.push({
              testCase: i + 1,
              passed: false,
              input: JSON.stringify(testCase.input),
              expected: JSON.stringify(testCase.expected),
              actual: "Error",
              error: pistonResult.run.stderr
            });
          } else {
            const output = pistonResult.run?.stdout?.trim() || "";
            let parsedOutput: any;
            
            try {
              parsedOutput = JSON.parse(output);
            } catch {
              parsedOutput = output;
            }
            
            const expected = testCase.expected;
            const passed = JSON.stringify(parsedOutput) === JSON.stringify(expected);
            
            results.push({
              testCase: i + 1,
              passed,
              input: JSON.stringify(testCase.input),
              expected: JSON.stringify(expected),
              actual: JSON.stringify(parsedOutput),
            });
          }
        } catch (execError: any) {
          results.push({
            testCase: i + 1,
            passed: false,
            input: JSON.stringify(testCase.input),
            expected: JSON.stringify(testCase.expected),
            actual: "Error",
            error: execError.message || "Execution failed"
          });
        }
      }
      
      res.json({ results });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Execution failed" });
    }
  });

  // Get all problems
  app.get("/api/problems", async (req, res) => {
    try {
      const problems = await storage.getProblems();
      res.json(problems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch problems" });
    }
  });

  // Get user interaction data for a problem (must be before :identifier route)
  app.get("/api/problems/:slug/interaction", async (req, res) => {
    try {
      const { slug } = req.params;
      const visitorId = req.query.visitorId as string || "anonymous";
      
      const interaction = await storage.getUserProblemInteraction(visitorId, slug);
      const problem = await storage.getProblemBySlug(slug);
      
      res.json({
        liked: interaction?.liked || false,
        disliked: interaction?.disliked || false,
        starred: interaction?.starred || false,
        solved: interaction?.solved || false,
        likes: problem?.likes || 0,
        dislikes: problem?.dislikes || 0
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interaction data" });
    }
  });

  // Like/unlike a problem
  app.post("/api/problems/:slug/like", async (req, res) => {
    try {
      const { slug } = req.params;
      const { visitorId } = req.body;
      
      const result = await storage.toggleLike(visitorId || "anonymous", slug);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Dislike/undislike a problem
  app.post("/api/problems/:slug/dislike", async (req, res) => {
    try {
      const { slug } = req.params;
      const { visitorId } = req.body;
      
      const result = await storage.toggleDislike(visitorId || "anonymous", slug);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle dislike" });
    }
  });

  // Star/unstar a problem
  app.post("/api/problems/:slug/star", async (req, res) => {
    try {
      const { slug } = req.params;
      const { visitorId } = req.body;
      
      const result = await storage.toggleStar(visitorId || "anonymous", slug);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle star" });
    }
  });

  // Get all interactions for a visitor (for main page)
  app.get("/api/interactions", async (req, res) => {
    try {
      const visitorId = req.query.visitorId as string || "anonymous";
      const interactions = await storage.getAllInteractions(visitorId);
      res.json(interactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interactions" });
    }
  });

  // Get a specific problem by ID or slug
  app.get("/api/problems/:identifier", async (req, res) => {
    try {
      const { identifier } = req.params;
      let problem;
      
      if (identifier.includes("-")) {
        problem = await storage.getProblemBySlug(identifier);
      } else {
        problem = await storage.getProblem(identifier);
      }
      
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }
      
      res.json(problem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch problem" });
    }
  });

  // Submit a solution
  app.post("/api/submissions", async (req, res) => {
    try {
      const submissionData = insertSubmissionSchema.parse(req.body);
      
      const submission = await storage.createSubmission(submissionData);

      const isAccepted = submissionData.status === "Accepted";

      // Update user problem status
      const existing = await storage.getUserProblem(submissionData.userId, submissionData.problemId);
      if (existing) {
        await storage.updateUserProblem(submissionData.userId, submissionData.problemId, {
          solved: existing.solved || isAccepted,
          attempts: (existing.attempts || 0) + 1,
          lastAttemptAt: new Date()
        });
      } else {
        await storage.createUserProblem({
          visitorId: submissionData.userId, // Using userId as visitorId for persistence
          problemSlug: submissionData.problemId, // Using problemId as slug for status mapping
          solved: isAccepted,
          attempts: 1,
          lastAttemptAt: new Date()
        });
      }

      if (isAccepted) {
        // Update streak
        await storage.updateUserStreak(submissionData.userId);
        // Add reward points
        await storage.addRewardPoints(submissionData.userId, 10);
        
        // Check for badges (simple check)
        const problems = await storage.getProblems();
        const userProblems = await Promise.all(problems.map(p => storage.getUserProblem(submissionData.userId, p.id)));
        const solvedCount = userProblems.filter(p => p?.solved).length;
        
        const badges = await storage.getBadges();
        const userBadges = await storage.getUserBadges(submissionData.userId);
        
        for (const badge of badges) {
          const alreadyHas = userBadges.some(ub => ub.badgeId === badge.id);
          if (!alreadyHas) {
            const criteria = badge.criteria as any;
            if (criteria.type === 'solved_count' && solvedCount >= criteria.count) {
              await storage.awardBadge(submissionData.userId, badge.id);
            }
          }
        }
      }
      
      res.json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid submission data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit solution" });
    }
  });

  // Contests
  app.get("/api/contests", async (req, res) => {
    try {
      const contests = await storage.getContests();
      res.json(contests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contests" });
    }
  });

  app.get("/api/contests/:id", async (req, res) => {
    try {
      const contest = await storage.getContest(req.params.id);
      if (!contest) return res.status(404).json({ message: "Contest not found" });
      res.json(contest);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contest" });
    }
  });

  app.post("/api/contests/:id/join", async (req, res) => {
    try {
      const { userId } = req.body;
      const participant = await storage.joinContest({ contestId: req.params.id, userId });
      res.json(participant);
    } catch (error) {
      res.status(500).json({ message: "Failed to join contest" });
    }
  });

  app.get("/api/contests/:id/leaderboard", async (req, res) => {
    try {
      const participants = await storage.getContestParticipants(req.params.id);
      res.json(participants.sort((a, b) => (b.score || 0) - (a.score || 0)));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Gamification
  app.get("/api/users/:userId/streak", async (req, res) => {
    try {
      const streak = await storage.getUserStreak(req.params.userId);
      res.json(streak || { currentStreak: 0, longestStreak: 0 });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch streak" });
    }
  });

  app.get("/api/users/:userId/badges", async (req, res) => {
    try {
      const userBadges = await storage.getUserBadges(req.params.userId);
      const badges = await storage.getBadges();
      const detailedBadges = userBadges.map(ub => ({
        ...ub,
        badge: badges.find(b => b.id === ub.badgeId)
      }));
      res.json(detailedBadges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  app.get("/api/users/:userId/rewards", async (req, res) => {
    try {
      const rewards = await storage.getRewardPoints(req.params.userId);
      res.json(rewards || { points: 0 });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rewards" });
    }
  });

  app.get("/api/badges", async (req, res) => {
    try {
      const badges = await storage.getBadges();
      res.json(badges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  // Secure a contest result (Blockchain simulation)
  app.post("/api/contests/:id/secure", async (req, res) => {
    try {
      const { userId, score } = req.body;
      const hash = secureResult({ contestId: req.params.id, userId, score, timestamp: Date.now() });
      const updated = await storage.updateContestParticipant(req.params.id, userId, { blockchainHash: hash });
      res.json({ hash, updated });
    } catch (error) {
      res.status(500).json({ message: "Failed to secure result" });
    }
  });

  // Get user submissions with problem details
  app.get("/api/users/:userId/submissions-with-details", async (req, res) => {
    try {
      const { userId } = req.params;
      const submissions = await storage.getSubmissionsWithDetails(userId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions with details" });
    }
  });

  // Get user submissions
  app.get("/api/users/:userId/submissions", async (req, res) => {
    try {
      const { userId } = req.params;
      const { problemId } = req.query;
      
      const submissions = await storage.getSubmissions(userId, problemId as string);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  // Get user problem status
  app.get("/api/users/:userId/problems", async (req, res) => {
    try {
      const { userId } = req.params;
      const problems = await storage.getProblems();
      
      const userProblems = await Promise.all(
        problems.map(async (problem) => {
          const userProblem = await storage.getUserProblem(userId, problem.id);
          return {
            ...problem,
            solved: userProblem?.solved || false,
            attempts: userProblem?.attempts || 0
          };
        })
      );
      
      res.json(userProblems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user problems" });
    }
  });

  // Create or update user (for Firebase auth integration)
  app.post("/api/users", async (req, res) => {
    try {
      const userData = req.body;
      
      // Check if user exists
      let user = await storage.getUserByEmail(userData.email);
      if (user) {
        res.json(user);
      } else {
        user = await storage.createUser(userData);
        res.json(user);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to create/update user" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
