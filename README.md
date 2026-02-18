# devCollab - Backend API 🚀

[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-v5-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/database-MongoDB-green)](https://www.mongodb.com/)

---

## 🚀 Overview

The **devCollab backend** is a scalable REST API that powers authentication, social interaction, real-time messaging, and media handling for the devCollab platform.

Core responsibilities:

- 🔐 Secure **JWT authentication**
- ⚡ **Real-time updates** via Pusher
- 🖼️ **Cloudinary media storage**
- 👥 Social features (follow, posts, messaging, notifications)

**🌐 Live Backend:**  
https://dev-collab-backend.vercel.app/

---

## 🏗️ Architecture

- **Layered structure** → Routes, Controllers, Models, Middleware  
- **Centralized error handling** for consistent API responses  
- **Environment-based configuration** for secure deployment  

---

## 📂 Project Structure

```text
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
└── server.js
```

---

## 🛠️ Tech Stack

**Node.js · Express · MongoDB · Mongoose · JWT · Bcrypt · Pusher · Cloudinary**

---

## 💻 Local Setup

### Install dependencies
```bash
npm install
```

### Create `.env`
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=...
```

### Run dev server
```bash
npm run dev
```

---

## 📝 API Endpoints

### Auth & Users
- `POST /api/auth/register` — create account  
- `POST /api/auth/login` — receive JWT  
- `GET /api/users/:id` — get profile  
- `POST /api/users/follow/:id` — follow/unfollow  

### Posts
- `GET /api/posts` — global feed  
- `POST /api/posts` — create post  
- `DELETE /api/posts/:id` — delete post  

### Messaging
- `POST /api/messages` — send message  
- `GET /api/notifications` — fetch alerts  

---

## 🌐 Deployment

Configured for **Vercel** deployment.  
Add all environment variables in the Vercel dashboard before running production.

---

**Built for developers.**
