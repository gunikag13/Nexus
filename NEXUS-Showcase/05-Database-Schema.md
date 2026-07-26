# Database Schema

NEXUS uses **MongoDB Atlas** as its primary cloud database. Data is organized into independent collections that represent the major functional modules of the application.

The schema is designed to ensure:

- Data isolation between users
- Fast document retrieval
- Simple scalability
- Flexible document structures
- Easy feature expansion

---

# Database Overview

```
                    MongoDB Atlas
                          │
      ┌───────────┬────────┴─────────┬──────────┐
      ▼           ▼                  ▼          ▼
    Users       Notes           Flashcards    Quizzes
                                               │
                                               ▼
                                             Tasks
```

Each authenticated user owns their own set of documents. No document belonging to one user can be accessed by another.

---

# Collection Overview

| Collection | Purpose |
|------------|---------|
| Users | Stores authentication and profile information |
| Notes | Stores academic notes created by users |
| Flashcards | Stores AI-generated study cards |
| Quizzes | Stores AI-generated quizzes |
| Tasks | Stores planner and study tasks |

---

# User Collection

The **Users** collection manages authentication and user identity.

## Fields

| Field | Type | Description |
|------|------|-------------|
| _id | ObjectId | Unique user identifier |
| name | String | User's full name |
| email | String | Unique email address |
| password | String | bcrypt hashed password |
| createdAt | Date | Account creation timestamp |
| updatedAt | Date | Last profile update |

---

## Relationships

```
User
 │
 ├── Notes
 ├── Flashcards
 ├── Quizzes
 └── Tasks
```

Every other collection references the authenticated user.

---

# Notes Collection

The Notes collection stores academic content created by users.

## Fields

| Field | Type | Description |
|------|------|-------------|
| _id | ObjectId | Note identifier |
| user | ObjectId | Owner of the note |
| title | String | Note title |
| subject | String | Subject name |
| content | String | Main note content |
| tags | Array | User-defined tags |
| pinned | Boolean | Pin status |
| createdAt | Date | Creation time |
| updatedAt | Date | Last modification |

---

## Example Structure

```json
{
  "_id": "...",
  "user": "...",
  "title": "Operating Systems",
  "subject": "Computer Science",
  "content": "...",
  "tags": [
    "OS",
    "Processes"
  ],
  "pinned": true
}
```

---

# Flashcards Collection

The Flashcards collection stores question-answer pairs generated from notes.

## Fields

| Field | Type | Description |
|------|------|-------------|
| _id | ObjectId | Flashcard identifier |
| user | ObjectId | Owner |
| note | ObjectId | Source note |
| question | String | Flashcard question |
| answer | String | Flashcard answer |
| createdAt | Date | Creation timestamp |

---

## Relationship

```
User
 │
 └── Note
      │
      ▼
 Flashcards
```

Each flashcard is associated with both a user and the note from which it was generated.

---

# Quiz Collection

Stores AI-generated quizzes.

## Fields

| Field | Type | Description |
|------|------|-------------|
| _id | ObjectId | Quiz identifier |
| user | ObjectId | Owner |
| note | ObjectId | Source note |
| questions | Array | List of MCQs |
| score | Number | User score |
| createdAt | Date | Creation timestamp |

---

Each quiz question contains:

- Question
- Options
- Correct Answer
- Explanation

---

# Tasks Collection

The planner module stores study tasks.

## Fields

| Field | Type | Description |
|------|------|-------------|
| _id | ObjectId | Task identifier |
| user | ObjectId | Owner |
| title | String | Task title |
| completed | Boolean | Completion status |
| dueDate | Date | Due date |
| createdAt | Date | Creation timestamp |

---

# Relationships

```
                 User
                   │
      ┌────────────┼─────────────┐
      ▼            ▼             ▼
    Notes      Flashcards     Quizzes
      │
      ▼
    Tasks
```

Every collection maintains a reference to its owner, ensuring proper authorization and complete user isolation.

---

# Data Integrity

The application maintains database integrity through:

- Required field validation
- Unique email addresses
- JWT-based ownership verification
- Mongoose schema validation
- Automatic timestamps

---

# Security Considerations

Sensitive information is protected through several mechanisms.

## Password Storage

Passwords are never stored in plain text.

```
User Password
      │
      ▼
bcrypt Hash
      │
      ▼
MongoDB
```

---

## User Isolation

Every database query is performed using the authenticated user's ID.

Example:

```
Find Notes

WHERE

note.user == authenticatedUser
```

This prevents users from accessing documents that belong to another account.

---

# Design Decisions

Several design choices were made while developing the database.

### MongoDB

Chosen because:

- Flexible schema
- JSON document structure
- Excellent Node.js integration
- Cloud deployment through MongoDB Atlas

---

### Separate Collections

Rather than storing everything inside one large document, each feature has its own collection.

Advantages include:

- Better scalability
- Easier maintenance
- Independent feature development
- Cleaner queries

---

### Object References

Collections reference users and notes using ObjectIds instead of embedding large documents.

Benefits include:

- Reduced data duplication
- Smaller document size
- Faster updates
- Easier relationships

---

# Future Database Enhancements

The schema is designed to support future modules without major structural changes.

Possible future collections include:

- AI Conversations
- Attachments
- Notifications
- Study Sessions
- Revision History
- Achievements
- User Preferences

---

# Database Summary

The NEXUS database follows a modular document-based design using MongoDB Atlas.

Each functional module maintains its own collection while preserving relationships through ObjectId references. This architecture supports secure user isolation, efficient querying, and future scalability without requiring significant schema redesign.