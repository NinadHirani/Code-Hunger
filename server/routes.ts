import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubmissionSchema, insertUserProblemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all problems
  app.get("/api/problems", async (req, res) => {
    try {
      const problems = await storage.getProblems();
      res.json(problems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch problems" });
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
      
      // Simulate code execution and validation
      const isAccepted = Math.random() > 0.3; // 70% success rate for demo
      const status = isAccepted ? "Accepted" : "Wrong Answer";
      const runtime = isAccepted ? Math.floor(Math.random() * 100) + 20 : null;
      const memory = isAccepted ? Math.floor(Math.random() * 50) + 10 : null;
      
      const submission = await storage.createSubmission({
        ...submissionData,
        status,
        runtime,
        memory
      });

      // Update user problem status if accepted
      if (isAccepted) {
        const existing = await storage.getUserProblem(submissionData.userId, submissionData.problemId);
        if (existing) {
          await storage.updateUserProblem(submissionData.userId, submissionData.problemId, {
            solved: true,
            lastAttemptAt: new Date()
          });
        } else {
          await storage.createUserProblem({
            userId: submissionData.userId,
            problemId: submissionData.problemId,
            solved: true,
            attempts: 1,
            lastAttemptAt: new Date()
          });
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

  // Get user interaction data for a problem
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

  const httpServer = createServer(app);

  return httpServer;
}
