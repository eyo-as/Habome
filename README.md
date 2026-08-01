# Habome

Habome is a full-stack property marketplace platform that connects property seekers, property owners, and administrators. The platform supports property discovery, favorites, owner-led property management, direct owner messaging, and admin moderation in a single experience.

## Overview

This repository contains the complete Habome application split into two main services:

- Frontend: Next.js application for the public-facing marketplace and dashboard experience
- Backend: Express.js API with MongoDB persistence for authentication, property management, messaging, favorites, uploads, and admin operations

## Core Features

### For customers

- Browse published properties
- Search and filter listings
- View detailed property information
- Save favorite properties
- Contact property owners directly

### For property owners

- Register and sign in
- Create and manage property listings
- Upload property images
- Publish, archive, and manage listing status
- View their own property dashboard

### For administrators

- Review and manage platform properties
- Disable or remove listings
- Manage users
- View platform metrics

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios
- Vercel-ready deployment setup

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- Cloudinary for image storage
- CORS, dotenv, bcryptjs

## Project Structure

```text
habome/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── package.json
└── resources/
```

## Local Development

### Prerequisites

- Node.js 18+
- pnpm (for frontend)
- npm (for backend)
- MongoDB instance
- Cloudinary account

### 1. Clone the repository

```bash
git clone <repository-url>
cd habome
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Run the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
pnpm install
```

Create a `.env.local` file in the frontend folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
pnpm dev
```

The frontend should be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## Available Scripts

### Backend

- `npm run dev` — start backend in development mode
- `npm run start` — start backend in production mode

### Frontend

- `pnpm dev` — start local development server
- `pnpm build` — create a production build
- `pnpm start` — start the production server
- `pnpm lint` — run lint checks

## API Overview

The backend exposes REST endpoints under `/api` for:

- Authentication: `/api/auth`
- Properties: `/api/properties`
- Favorites: `/api/favorites`
- Messaging: `/api/contact`
- Admin actions: `/api/admin`
- Uploads: `/api/upload`

Health check endpoint:

```bash
curl http://localhost:5000/api/health
```

## Deployment Notes

The application is designed for deployment across a modern cloud stack:

- Frontend: Vercel
- Backend: Render or similar Node.js hosting
- Database: MongoDB Atlas
- Media storage: Cloudinary

Production environment variables should be set in the hosting platform for both frontend and backend services.

## Development Notes

- The backend uses a role-based access model for users, owners, and admins.
- Property visibility is controlled by listing status such as draft, published, archived, and disabled.
- Favorites and contact messages are persisted in MongoDB.
- The frontend uses server-safe rendering strategies for production stability.

## Contribution Guidelines

1. Create a feature branch from the latest main branch.
2. Keep changes focused and well-documented.
3. Test locally before opening a pull request.
4. Update environment documentation if new configuration is introduced.
5. Keep the codebase consistent with the existing project structure.

## Status

Habome is a working full-stack project with core marketplace functionality implemented and prepared for deployment and further iteration.
