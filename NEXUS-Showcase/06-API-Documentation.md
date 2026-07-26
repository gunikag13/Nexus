# API Documentation

NEXUS exposes a RESTful API that powers all frontend functionality. Every request from the React frontend is processed through the Express backend before interacting with MongoDB Atlas or external AI services.

All endpoints return JSON responses and follow consistent HTTP status codes and response structures.

---

# Base URL

### Development

```text
http://localhost:5000/api
```

### Production

```text
https://nexus-three-topaz.vercel.app/
```

---

# Authentication

Protected endpoints require a valid JWT token.

Include the token in the request header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# Standard Response Format

## Success Response

```json
{
    "success": true,
    "message": "Operation completed successfully.",
    "data": {}
}
```

---

## Error Response

```json
{
    "success": false,
    "message": "Description of the error.",
    "data": {}
}
```

---

# Authentication APIs

Authentication endpoints manage user registration, login, and session validation.

---

## Register User

**POST**

```http
/api/auth/signup
```

### Request Body

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

### Success

- Creates a new account
- Encrypts the password using bcrypt
- Returns JWT token

---

## Login

**POST**

```http
/api/auth/login
```

### Request Body

```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

### Success

- Verifies credentials
- Generates JWT
- Returns authenticated user

---

## Current User

**GET**

```http
/api/auth/me
```

### Authentication Required

✅ Yes

Returns the currently authenticated user's profile.

---

## Logout

**POST**

```http
/api/auth/logout
```

### Authentication Required

✅ Yes

Invalidates the current session on the client.

---

# Notes APIs

The Notes module provides complete CRUD functionality.

---

## Get Notes

**GET**

```http
/api/notes
```

### Query Parameters

| Parameter | Description |
|------------|-------------|
| search | Search notes |
| subject | Filter by subject |
| sort | newest, oldest, pinned |
| page | Pagination |
| limit | Number of notes |

---

## Get Single Note

**GET**

```http
/api/notes/:id
```

Returns a single note by its unique identifier.

---

## Create Note

**POST**

```http
/api/notes
```

### Example Body

```json
{
    "title": "Operating Systems",
    "subject": "Computer Science",
    "content": "..."
}
```

---

## Update Note

**PUT**

```http
/api/notes/:id
```

Updates an existing note.

---

## Pin / Unpin Note

**PATCH**

```http
/api/notes/:id/pin
```

Marks a note as pinned or removes the pinned status.

---

## Delete Note

**DELETE**

```http
/api/notes/:id
```

Permanently removes a note.

---

# AI APIs

The AI module generates study material from existing notes.

> **Note:** These endpoints require a configured AI provider and valid API credentials.

---

## Generate Summary

**POST**

```http
/api/ai/summarize
```

Returns a concise summary of the selected note.

---

## Explain Concept

**POST**

```http
/api/ai/explain
```

Explains the selected note using simplified language.

---

## Extract Key Concepts

**POST**

```http
/api/ai/key-concepts
```

Returns the most important concepts as bullet points.

---

## Generate Study Tips

**POST**

```http
/api/ai/study-tips
```

Suggests effective revision strategies.

---

## Generate Mnemonics

**POST**

```http
/api/ai/mnemonics
```

Creates memory aids based on the note content.

---

## Generate Revision Sheet

**POST**

```http
/api/ai/revision-sheet
```

Produces a compact revision guide.

---

## Generate Flashcards

**POST**

```http
/api/ai/flashcards
```

Generates question-answer flashcards from a note.

---

## Generate Quiz

**POST**

```http
/api/ai/quiz
```

Creates multiple-choice questions for self-assessment.

---

# Flashcard APIs

---

## Get Flashcards

**GET**

```http
/api/flashcards
```

Returns all flashcards belonging to the authenticated user.

---

## Create Flashcards

**POST**

```http
/api/flashcards
```

Creates new flashcards.

---

## Delete Flashcards

**DELETE**

```http
/api/flashcards/:id
```

Deletes a flashcard collection.

---

# Quiz APIs

---

## Get Quizzes

**GET**

```http
/api/quizzes
```

Returns previously generated quizzes.

---

## Create Quiz

**POST**

```http
/api/quizzes
```

Creates a new quiz.

---

## Delete Quiz

**DELETE**

```http
/api/quizzes/:id
```

Removes a quiz.

---

# Planner APIs

---

## Get Tasks

**GET**

```http
/api/tasks
```

Returns all planner tasks.

---

## Create Task

**POST**

```http
/api/tasks
```

Creates a new study task.

---

## Update Task

**PUT**

```http
/api/tasks/:id
```

Updates task details.

---

## Delete Task

**DELETE**

```http
/api/tasks/:id
```

Deletes a planner task.

---

# Dashboard APIs

---

## Dashboard Overview

**GET**

```http
/api/dashboard
```

Returns dashboard statistics including:

- Total Notes
- Flashcard Count
- Quiz Count
- Pending Tasks
- Recent Activity

---

# HTTP Status Codes

| Status | Meaning |
|---------|---------|
| **200** | Request completed successfully |
| **201** | Resource created successfully |
| **400** | Invalid request or validation error |
| **401** | Authentication required |
| **403** | Access forbidden |
| **404** | Resource not found |
| **409** | Conflict (e.g., duplicate email) |
| **429** | Rate limit exceeded |
| **500** | Internal server error |

---

# Security

The API follows several security practices:

- JWT-based authentication
- Password hashing using bcrypt
- User-level resource isolation
- Environment variable protection
- Secure database connections
- CORS configuration for trusted origins

---

# API Design Principles

The API is designed to be:

- RESTful
- Stateless
- Modular
- Consistent
- Secure
- Easy to extend

Every endpoint follows a predictable structure, making the backend straightforward to integrate with web or mobile clients in the future.