# devCollab - Backend API 🚀

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-v5.2.1-blue)](https://expressjs.com/)

The robust server-side engine powering devCollab, focusing on performance, real-time communication, and secure data management.

**🌐 Live Site:** [https://dev-collab-frontend-alpha.vercel.app/](https://dev-collab-frontend-alpha.vercel.app/)

## 🏗️ Architecture
- **Layered Pattern**: Separate Routes, Controllers, Models, and Middleware.
- **Real-time Engine**: Leverages **Pusher Channels** for low-latency updates without the overhead of maintaining raw WebSockets.
- **Media Management**: Uses **Cloudinary** for on-the-fly image transformations and optimized delivery.

---

## 🚀 Local Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```
2. **Environment Configuration**
   Create a `.env` file with your credentials:
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
3. **Execution**
   ```bash
   npm run dev
   ```

---

## �️ API Reference

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new developer account. |
| `POST` | `/api/auth/login` | Authenticate and receive JWT. |

### User Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users/:id` | Retrieve profile data. |
| `PUT` | `/api/users/update` | Update user details/avatar (Protected). |
| `POST` | `/api/users/follow/:id` | Follow/Unfollow a developer. |

### Posts & Collaboration
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/posts` | Fetch the global project feed. |
| `POST` | `/api/posts` | Upload new project details with images. |
| `DELETE` | `/api/posts/:id` | Remove a post (Owner only). |

### Real-time
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/messages` | Send DM and trigger Pusher event. |
| `GET` | `/api/notifications` | Get latest activity alerts. |

---

## 🛠️ Built With
- **Mongoose**: For structured MongoDB data modeling.
- **BcryptJS**: Ensuring user passwords are never stored in plain text.
- **Multer**: Handling multi-part/form-data for image uploads.

## ⚠️ Troubleshooting
- **CORS Issues**: Ensure the `origin` in `server.js` matches your frontend URL.
- **Pusher Connection**: Double-check your `PUSHER_CLUSTER` and keys in `.env`.
