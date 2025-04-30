# Street Food Discovery Website

# 🌐 Live Backend Link
Check out our [Live Link]() 


## Description
This project is a web application designed to allow users to discover, post, review, and interact with street food spots. The website caters to multiple user roles, including Normal Users, Premium Users, and Admins, each with varying levels of access and functionality.



## 🛠 Tech Stack
- **Node.js:** JavaScript runtime for scalable backend development.
- **Express.js:** Lightweight framework for building RESTful APIs.
- **TypeScript:** Adds static typing for safer and maintainable code.
- **Prisma ORM:** Simplifies database interactions with PostgreSQL.
- **PostgreSQL:** Reliable relational database for data persistence.


## ⚙️ Setup Guide
Follow these steps to set up and run the project locally:

 ## 📋 Prerequisites

- **Node.js** (version 16 or above)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **GIT** 

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```


- **Start Development Server:**

  ```bash
  yarn dev
  ```
  
- **Set Up the Database**
   -Ensure PostgreSQL is running.

   -Apply Prisma migrations to create the database schema:

  ```bash
  npx prisma migrate dev
  ```

- **Build for Production:**

  ```bash
  npm run build
  ```


## ✨Endpoints:

## ✅ USER ROUTES - /api/user
### ============================================

### ✅ GET /api/user/
### Access: ADMIN
### Description: Fetch all users from the database.

### ✅ GET /api/user/me
### Access: ADMIN, USER
### Description: Get profile details of the currently logged-in user.

### ✅ POST /api/user/create-admin
### Access: Public (or depends on route-level restriction)
### Description: Create a new admin user.
### Note: Accepts a file (e.g. profile picture) and JSON data in multipart/form-data.

### ✅ POST /api/user/create-user
### Access: Public
### Description: Create a new regular user.
### Note: Accepts a file and JSON data in multipart/form-data.

### ✅ PATCH /api/user/:id/status
## Access: ADMIN
### Description: Change a user’s profile status (e.g., activate, deactivate).

### ✅ PATCH /api/user/update-my-profile
### Access: ADMIN, USER
### Description: Update own profile with new data or profile image.
### Note: Accepts multipart/form-data.

### ============================================


## ✅ AUTH ROUTES - /api/auth
### ============================================

### ✅ POST /api/auth/login
### Access: Public
### Description: Logs in a user and returns access & refresh tokens.

### ✅ POST /api/auth/refresh-token
### Access: Public
### Description: Returns new access token using a valid refresh token.

### ✅ POST /api/auth/change-password
### Access: ADMIN, USER
### Description: Authenticated users can change their password.

 ✅ POST /api/auth/forgot-password
### Access: Public
### Description: Sends a password reset link/token to the user's email.

### ✅ POST /api/auth/reset-password
### Access: Public
### Description: Resets the password using a valid token and new password.

### ============================================



## ✅ CATEGORY ROUTES - /api/category
### ============================================

### ✅ GET /api/category/
### Access: Public
### Description: Fetch all categories from the database.

### ✅ GET /api/category/:id
### Access: Public
### Description: Fetch a single category by its ID.

### ✅ POST /api/category/create-category
### Access: ADMIN, USER
### Description: Create a new category. Accepts multipart/form-data with an image file and JSON data.

### ✅ DELETE /api/category/:id
## Access: ADMIN
### Description: Delete a category by its ID.

### ============================================



## ✅ POSTS ROUTES - /api/post
### ============================================

### ✅ GET /api/post/get-approved-post
### Access: USER
### Description: Fetch all approved posts (accessible to regular users).

### ✅ GET /api/post
### Access: ADMIN
### Description: Fetch all posts from the database (for admin).

### ✅ GET /api/post/:id
### Access: ADMIN
### Description: Fetch a specific post by ID (for admin).

### ✅ GET /api/post/get-pending-post
### Access: ADMIN
### Description: Fetch all pending posts awaiting approval.

### ✅ GET /api/post/get-approved-post/:id
### Access: Public
### Description: Fetch an approved post by its ID (for viewing).

### ✅ POST /api/post/create-post
### Access: USER
### Description: Create a new post with image. Accepts multipart/form-data (file + JSON).

### ✅ PATCH /api/post/update-status/:id
### Access: ADMIN
### Description: Update the approval status of a post (PENDING/APPROVED/REJECTED).

### ✅ PATCH /api/post/update-post/:id
### Access: USER
### Description: Update your own post with new data or image. Accepts multipart/form-data.

### ✅ PATCH /api/post/premium/:id
### Access: ADMIN
### Description: Mark a post as premium (only if the post is already approved).

### ✅ DELETE /api/post/:id
### Access: ADMIN
### Description: Delete a post by its ID.

# ============================================



## ✅ COMMENT ROUTES - /api/comment
### ============================================

### ✅ GET /api/comment/
### Access: Public
### Description: Fetch all comments from the database.

### ✅ GET /api/comment/:id
### Access: Public
### Description: Fetch a specific comment by its ID.

### ✅ POST /api/comment/:postId
### Access: USER
### Description: Add a comment to a post. Requires authentication.

### ✅ DELETE /api/comment/:id
### Access: ADMIN
### Description: Delete a specific comment by ID. Requires admin access.

### ============================================



## ✅ VOTE ROUTES - /api/vote
### ============================================

### ✅ GET /api/vote/
### Access: Public
### Description: Fetch all votes from the database.

### ✅ GET /api/vote/:id
### Access: Public
### Description: Fetch a specific vote by its ID.

### ✅ POST /api/vote/:postId
### Access: USER
### Description: Cast a vote on a post. Requires authentication.

### ✅ DELETE /api/vote/:postId
### Access: USER
### Description: Remove a vote from a post. Requires authentication.

### ============================================



## ✅ REVIEW ROUTES - /api/review
### ============================================

### ✅ GET /api/review/
### Access: Public
### Description: Fetch all reviews from the database.

### ✅ GET /api/review/:id
### Access: Public
### Description: Fetch a specific review by its ID.

### ✅ POST /api/review/:postId
### Access: USER
### Description: Submit a review for a post. Requires authentication.

### ✅ DELETE /api/review/:postId
### Access: USER
### Description: Delete your review from a post. Requires authentication.





## Folder Structure
```bash
Street_Food_Discovery_Website/
│── .vercel/
│── node_modules/
│── dist/
│── src/
│   ├── app/
|   |   │── modules
│   |   |         ├── Auth
|   |   |         |     |-controller.ts
|   |   |         |     |-service.ts
|   |   |         |     |-route.ts
│   |   |         ├── Category
|   |   |         |     |-controller.ts
|   |   |         |     |-service.service.ts
|   |   |         |     |-service.route.ts
│   |   |         ├── Comment
|   |   |         |     |-controller.ts
|   |   |         |     |-service.ts
|   |   |         |     |-route.ts       
│   |   |         ├── Posts
|   |   |         |     |-controller.ts
|   |   |         |     |-service.ts
|   |   |         |     |-route.ts       
│   |   |         ├── Review
|   |   |         |     |-controller.ts
|   |   |         |     |-service.ts
|   |   |         |     |-route.ts       
│   |   |         ├── User
|   |   |         |     |-controller.ts
|   |   |         |     |-service.ts
|   |   |         |     |-route.ts       
│   |   |         ├── Vote
|   |   |         |     |-controller.ts
|   |   |         |     |-service.ts
|   |   |         |     |-route.ts       
|   |   │── middlewares
│   |   |          ├── globalErrorHandlers.ts
│   |   |          ├── validateRequest.ts
│   |   |          ├── auth.ts
│   |   |          ├── emailSender.ts
|   |   │── interfaces
│   |   |          ├── common.ts
│   |   |          ├── file.ts
│   |   |          ├── pagination.ts
|   |   │── error
│   |   |          ├── AppError.ts
|   |   │── routes
│   |   |          ├── index.ts
│   ├── generated/
│   ├── helpers/
│   ├── shared/
│   │        ├── catchAsync.ts
│   │        ├── sendResponse.ts
│   │        ├── prisma.ts
│   │        ├── pick.ts
│   ├── helpers/
│   │        ├── fileUploader.ts
│   │        ├── jwtHelpers.ts
│   │        ├── paginationHelpers.ts
│   ├── app.ts
│   │   
│   ├── server.ts
│── uploads
│── .env
│── .gitignore
│── README.md
│── tsconfig.json
│── yarn.lock
```
