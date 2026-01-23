## Project Summary
Code-Hunger is a comprehensive competitive programming platform designed for developers to practice coding problems, participate in timed contests, and track their progress through a gamified leveling system. It features a modern, LeetCode-inspired interface with real-time feedback, detailed problem descriptions, and a robust code execution environment.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion, Wouter (Routing), TanStack Query (Data Fetching), Lucide React (Icons), Radix UI (Headless Components).
- **Backend**: Express.js, Node.js, Drizzle ORM (Database Management), SQLite/PostgreSQL (Storage), OpenAI (AI Chatbot), Piston API (Code Execution).
- **Gamification**: Badges, XP, streaks, and reward points.
- **Security**: Blockchain-simulated hashing for contest results.

## Architecture
- `client/`: React frontend application.
  - `src/components/`: Reusable UI components (Modals, Topbar, Workspace, Chatbot).
  - `src/pages/`: Main application views (Home, Profile, Problems, Contests).
  - `src/lib/`: Utilities and API clients.
- `server/`: Express backend application.
  - `routes.ts`: API endpoints and AI integration.
  - `storage.ts`: Database abstraction layer.
- `shared/`: Shared types and database schemas using Zod.

## User Preferences
- **Theme**: Defaulting to Dark Mode for the entire application.
- **AI Integration**: AI helpbot (Chatbot) should be constantly accessible in the bottom-right corner across all pages.
- **Styling**: Using a vibrant "brand-orange" accent color throughout the UI.

## Project Guidelines
- **Responsive Design**: Ensure all components and pages are mobile-friendly.
- **Consistent Branding**: Mimic the provided design patterns (circular icons, specific font choices, and orange accents).
- **Real-time Feedback**: Use toasts and progress bars to inform users of actions and leveling progress.

## Common Patterns
- **Global Components**: Add global components (like the Chatbot or Toaster) in `client/src/App.tsx` outside the main `Router`.
- **API Interactions**: Use `fetch` for custom API routes and TanStack Query for data fetching from `/api/` endpoints.
