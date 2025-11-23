# 🔥 Firebase Firestore Collection Setup Guide

This guide details the exact collections and document structures required for the CodeGuideX application to function correctly.

## 1. `users` Collection
Stores user profiles and authentication details.

- **Collection Name**: `users`
- **Document ID**: `User UID` (from Authentication)

**Fields**:
```json
{
  "uid": "string (same as doc ID)",
  "email": "string",
  "displayName": "string",
  "photoURL": "string (url)",
  "role": "string ('student' | 'admin' | 'mentor')",
  "bio": "string",
  "skills": ["array", "of", "strings"],
  "joinedDate": "timestamp",
  "lastActive": "timestamp",
  "isSuspended": "boolean"
}
```

## 2. `communities` Collection
Stores community details.

- **Collection Name**: `communities`
- **Document ID**: `Auto-generated`

**Fields**:
```json
{
  "name": "string",
  "description": "string",
  "category": "string",
  "icon": "string (url)",
  "banner": "string (url)",
  "createdBy": "string (User UID)",
  "createdAt": "timestamp",
  "memberCount": "number",
  "visibility": "string ('public' | 'private')",
  "isSuspended": "boolean"
}
```

## 3. `posts` Sub-collection
Stores posts within a community.

- **Collection Path**: `communities/{communityId}/posts`
- **Document ID**: `Auto-generated`

**Fields**:
```json
{
  "title": "string",
  "content": "string",
  "authorId": "string (User UID)",
  "authorName": "string",
  "authorPhotoURL": "string",
  "communityId": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "status": "string ('published' | 'draft' | 'archived')",
  "votes": {
    "upVotes": "number",
    "downVotes": "number",
    "totalVotes": "number"
  },
  "commentCount": "number",
  "viewCount": "number"
}
```

## 4. `comments` Sub-collection
Stores comments on a post.

- **Collection Path**: `communities/{communityId}/posts/{postId}/comments`
- **Document ID**: `Auto-generated`

**Fields**:
```json
{
  "content": "string",
  "authorId": "string (User UID)",
  "authorName": "string",
  "authorPhotoURL": "string",
  "postId": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "votes": "number"
}
```

## 5. `reports` Collection
Stores user reports for moderation.

- **Collection Name**: `reports`
- **Document ID**: `Auto-generated`

**Fields**:
```json
{
  "type": "string ('post' | 'comment' | 'user' | 'community')",
  "reason": "string",
  "description": "string",
  "reportedBy": {
    "id": "string",
    "displayName": "string",
    "email": "string"
  },
  "reportedContent": {
    "id": "string",
    "title": "string (optional)",
    "content": "string (optional)",
    "author": {
      "id": "string",
      "displayName": "string"
    }
  },
  "status": "string ('pending' | 'investigating' | 'resolved' | 'dismissed')",
  "createdAt": "timestamp",
  "resolvedAt": "timestamp (optional)",
  "resolvedBy": {
    "id": "string",
    "displayName": "string"
  }
}
```

## 6. `mentors` Collection
Stores mentor profiles.

- **Collection Name**: `mentors`
- **Document ID**: `User UID`

**Fields**:
```json
{
  "userId": "string",
  "displayName": "string",
  "email": "string",
  "bio": "string",
  "expertise": ["array", "of", "strings"],
  "hourlyRate": "number",
  "availability": {
    "weekdays": ["array", "of", "strings"],
    "hours": ["array", "of", "strings"]
  },
  "rating": "number",
  "reviewCount": "number",
  "isVerified": "boolean"
}
```

## 7. `bookings` Collection
Stores mentor session bookings.

- **Collection Name**: `bookings`
- **Document ID**: `Auto-generated`

**Fields**:
```json
{
  "mentorId": "string",
  "studentId": "string",
  "date": "timestamp",
  "duration": "number (minutes)",
  "status": "string ('pending' | 'confirmed' | 'completed' | 'cancelled')",
  "paymentStatus": "string ('pending' | 'paid')",
  "meetingLink": "string",
  "createdAt": "timestamp"
}
```

---

### 🚀 How to Create These Manually (for testing)

1.  Go to **Firebase Console** > **Firestore Database**.
2.  Click **Start collection**.
3.  Enter the **Collection ID** (e.g., `users`).
4.  Click **Next**.
5.  Enter a **Document ID** (click *Auto-ID* for random, or paste a User UID).
6.  Add the **Fields** as described above.
7.  Click **Save**.

**Tip**: You only need to create the top-level collections (`users`, `communities`, `reports`, `mentors`, `bookings`). Sub-collections (`posts`, `comments`) are created automatically when you add a document to them via code or console.