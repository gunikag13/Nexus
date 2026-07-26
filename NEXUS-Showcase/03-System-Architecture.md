# System Architecture

NEXUS follows a modern client-server architecture based on the MERN stack. The application separates responsibilities between the frontend, backend, database, and AI services, making the system modular, scalable, and easier to maintain.

The frontend communicates exclusively with the backend through RESTful APIs. All business logic, authentication, and database operations are handled by the backend before interacting with external services such as MongoDB Atlas or the AI provider.

---

# High-Level Architecture

```text
                         User
                           │
                           ▼
                  React + Vite Frontend
                           │
                    HTTPS / REST API
                           │
                           ▼
                 Express.js Backend API
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
 JWT Authentication   MongoDB Atlas      AI Service
        │                  │                  │
        └─────────────── Application Logic ───┘
```

---

# Architectural Principles

The application follows several software engineering principles:

- Separation of Concerns
- Modular Project Structure
- RESTful API Design
- Stateless Authentication
- Layered Backend Architecture
- Cloud-Based Infrastructure

Each component is responsible for a specific task, reducing coupling and improving maintainability.

---

# Frontend Architecture

The frontend is built using **React** and **Vite**.

It is responsible for:

- Rendering the user interface
- Managing application state
- Handling user interactions
- Calling backend APIs
- Managing authentication tokens
- Displaying AI-generated content

## Major Components

- Authentication Pages
- Dashboard
- Notes
- Flashcards
- Quiz
- Planner
- Settings
- Shared UI Components

---

# Backend Architecture

The backend is built using **Node.js** and **Express.js**.

Rather than placing all logic inside route handlers, the backend is organized into multiple layers.

```text
Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Models
   │
   ▼
MongoDB Atlas
```

This layered architecture keeps the codebase organized and simplifies future development.

---

# Routing Layer

Routes define the available API endpoints and forward incoming requests to the appropriate controller.

Examples include:

- Authentication Routes
- Notes Routes
- Dashboard Routes
- Flashcard Routes
- Quiz Routes
- Planner Routes
- AI Routes

---

# Controller Layer

Controllers receive HTTP requests and coordinate application logic.

Responsibilities include:

- Request validation
- Calling service functions
- Returning HTTP responses
- Error handling

Controllers do **not** directly communicate with the database.

---

# Service Layer

The service layer contains the core business logic.

Examples include:

- Creating notes
- Searching notes
- Generating AI responses
- Processing flashcards
- Building quizzes

Keeping business logic inside services improves code reusability and maintainability.

---

# Database Layer

MongoDB Atlas serves as the primary cloud database.

Collections include:

- Users
- Notes
- Flashcards
- Quizzes
- Tasks

Every document is associated with a specific user to ensure complete data isolation.

---

# Authentication Flow

Authentication is implemented using JSON Web Tokens (JWT).

```text
User Login
      │
      ▼
Backend verifies credentials
      │
      ▼
JWT Token Generated
      │
      ▼
Frontend stores token
      │
      ▼
Protected API Requests
      │
      ▼
JWT Verification Middleware
      │
      ▼
Requested Resource
```

This approach enables stateless authentication while protecting all user-specific resources.

---

# Request Lifecycle

A typical API request follows this sequence:

```text
User Action
      │
      ▼
React Component
      │
      ▼
Axios Request
      │
      ▼
Express Route
      │
      ▼
Controller
      │
      ▼
Service
      │
      ▼
Database / AI Service
      │
      ▼
Response
      │
      ▼
Frontend Update
```

This predictable request flow simplifies debugging and future feature development.

---

# AI Integration Architecture

AI functionality is implemented through dedicated backend endpoints.

The frontend never communicates directly with the AI provider.

```text
Frontend
     │
     ▼
Express API
     │
     ▼
AI Service
     │
     ▼
AI Provider
     │
     ▼
Generated Response
     │
     ▼
Frontend
```

This architecture provides several advantages:

- API keys remain secure
- AI providers can be replaced without changing the frontend
- Request validation occurs on the server
- Future rate limiting can be implemented centrally

---

# Deployment Architecture

The application is deployed using independent cloud services.

```text
React Frontend
      │
      ▼
Vercel

      │ HTTPS

      ▼

Express Backend
      │
      ▼
Render

      │
      ▼

MongoDB Atlas
```

This deployment model allows the frontend, backend, and database to scale independently.

---

# Security Considerations

The architecture incorporates multiple security practices:

- JWT Authentication
- Password Hashing using bcrypt
- Protected API Routes
- User Data Isolation
- Environment Variables for Secrets
- CORS Configuration
- Secure Database Authentication

---

# Scalability

The modular architecture allows additional functionality to be introduced with minimal impact on the existing codebase.

Future modules such as:

- Google Authentication
- OCR Processing
- AI Chat Assistant
- File Uploads
- Real-Time Collaboration
- Notifications

can be integrated without significant architectural changes.

---

# Architecture Summary

NEXUS is designed around a modular client-server architecture that separates presentation, business logic, persistence, and external integrations.

This design improves maintainability, supports future scalability, and reflects modern full-stack software engineering practices used in production applications.