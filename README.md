# 🍜 Street Food Discovery Website

## 🌐 Live Backend Link
[🔗 Visit Live](https://street-food-website-ten.vercel.app/)

## 📖 Description
A web application for discovering, posting, reviewing, and interacting with **street food spots**. It supports multiple roles:

- 👤 Normal Users
- 💎 Premium Users
- 🛡️ Admins

Each with different access and permissions.

![Street Food Discovery](https://i.ibb.co.com/1JjzKymK/italian-food-stationery-template-23-2148559232.jpg)

---

## 🛠 Tech Stack

- **Node.js** – JavaScript runtime for scalable backend
- **Express.js** – Framework for REST APIs
- **TypeScript** – Type-safe development
- **Prisma ORM** – Easy database access
- **PostgreSQL** – Relational database

---

## ⚙️ Setup Guide

### 📋 Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL (v12+)
- Git

### 🚀 Installation Steps

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


## 📡 API Endpoints

### ✅ USER ROUTES - `/api/user`

- `GET /` – 🔒 **Admin**: Get all users  
- `GET /me` – 🔐 **Logged-in**: Get own profile  
- `POST /create-admin` – 🌐 **Public**: Create admin  
- `POST /create-user` – 🌐 **Public**: Register user  
- `PATCH /:id/status` – 🔒 **Admin**: Update status  
- `PATCH /update-my-profile` – 🔐 **Logged-in**: Update own profile  


### ✅ AUTH ROUTES - `/api/auth`

- `POST /login` – 🌐 **Public**: Login & get tokens  
- `POST /refresh-token` – 🌐 **Public**: Get new token  
- `POST /change-password` – 🔐 **Logged-in**: Change password  
- `POST /forgot-password` – 🌐 **Public**: Request reset link  
- `POST /reset-password` – 🌐 **Public**: Reset password  



### ✅ CATEGORY ROUTES - `/api/category`

- `GET /` – 🌐 **Public**: Get all categories  
- `GET /:id` – 🌐 **Public**: Get one category  
- `POST /create-category` – 🔐 **Admin/User**: Add category  
- `DELETE /:id` – 🔒 **Admin**: Delete category  




### ✅ POSTS ROUTES - `/api/post`

- `GET /get-approved-post` – 🔐 **User**: Get approved posts  
- `GET /` – 🔒 **Admin**: Get all posts  
- `GET /:id` – 🔒 **Admin**: Get single post  
- `GET /get-pending-post` – 🔒 **Admin**: Get pending posts  
- `GET /get-rejected-post` – 🔒 **Admin**: Get rejected posts  
- `GET /get-approved-post/:id` – 🌐 **Public**: View single approved post  
- `POST /create-post` – 🔐 **User**: Add post  
- `PATCH /update-status/:id` – 🔒 **Admin**: Change post status  
- `PATCH /update-post/:id` – 🔐 **User**: Update own post  
- `PATCH /premium/:id` – 🔒 **Admin**: Mark post as premium  
- `DELETE /:id` – 🔒 **Admin**: Delete post  


### ✅ COMMENT ROUTES - `/api/comment`

- `GET /` – 🌐 **Public**: All comments  
- `GET /:id` – 🌐 **Public**: One comment  
- `POST /:postId` – 🔐 **User**: Add comment  
- `DELETE /:id` – 🔒 **Admin**: Delete comment  


### ✅ VOTE ROUTES - `/api/vote`

- `GET /` – 🌐 **Public**: All votes  
- `GET /:id` – 🌐 **Public**: One vote  
- `POST /:postId` – 🔐 **User**: Vote on a post  
- `DELETE /:postId` – 🔐 **User**: Remove vote  


### ✅ REVIEW ROUTES - `/api/review`

- `GET /` – 🌐 **Public**: All reviews  
- `GET /:id` – 🌐 **Public**: One review  
- `POST /:postId` – 🔐 **User**: Submit review  
- `DELETE /:postId` – 🔐 **User**: Delete own review  






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
