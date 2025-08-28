# Overview

This is a Code Hunger application built with modern web technologies. It's a full-stack coding practice platform that allows users to solve algorithmic problems, submit solutions, and track their progress. The application provides an interactive coding environment with syntax highlighting, problem descriptions, test case validation, and user authentication through Firebase.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React 18 and TypeScript, using a modern component-based architecture:

- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Code Editor**: CodeMirror 6 with JavaScript syntax highlighting and VS Code dark theme
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: TailwindCSS with custom LeetCode-inspired color palette and dark theme

## Backend Architecture
The backend follows a RESTful API design built with Express.js and TypeScript:

- **Server Framework**: Express.js with TypeScript for type safety
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Storage Layer**: Abstract storage interface with in-memory implementation for development
- **API Endpoints**: RESTful routes for problems, submissions, and user management
- **Development**: Hot reload with tsx and Vite middleware integration

## Database Design
PostgreSQL database with Drizzle ORM schema definitions:

- **Users Table**: Stores user profiles with email, username, display name, and avatar
- **Problems Table**: Contains coding problems with title, difficulty, description, examples, test cases, and starter code
- **Submissions Table**: Tracks user solution attempts with code, language, status, and performance metrics
- **User Problems Table**: Junction table tracking user progress on specific problems

## Authentication & Authorization
Firebase Authentication integration:

- **Provider**: Google OAuth for user sign-in
- **Flow**: Redirect-based authentication with automatic user creation/update in backend
- **Session Management**: Firebase handles token management and user sessions
- **Protected Routes**: Authentication context provider manages user state across components

## Code Execution & Validation
Simulated code execution environment:

- **Language Support**: JavaScript with extensible architecture for additional languages
- **Test Case Validation**: Problems include predefined test cases for solution verification
- **Status Tracking**: Submission results include acceptance status, runtime, and memory usage
- **Progress Tracking**: User problem completion and attempt counting

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection for production
- **Firebase**: Authentication services (Google OAuth)
- **Drizzle ORM**: Type-safe database operations and migrations
- **React Query**: Server state management and caching
- **Shadcn/ui + Radix UI**: Component library for consistent UI
- **CodeMirror**: Code editor with syntax highlighting
- **Tailwind CSS**: Utility-first CSS framework

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for server-side code
- **Replit Integration**: Development environment with runtime error overlay and cartographer

## Database & Hosting
- **PostgreSQL**: Primary database (configured for Neon in production)
- **Vercel/Netlify Ready**: Static asset serving and deployment configuration
- **Environment Variables**: DATABASE_URL and Firebase configuration keys required

The application is designed to be easily deployable with environment-specific configurations for development and production environments.