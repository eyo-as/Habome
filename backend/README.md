# Habome Backend Documentation

## Overview

This backend powers the Habome property listing platform. It provides authentication, property management, admin moderation, favorites, contact messaging, and image upload functionality for the frontend.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- Cloudinary for image uploads
- bcryptjs for password hashing
- dotenv for environment configuration

## Project Structure

```text
backend/
├── server.js
├── package.json
├── .env
├── .env.example
└── src/
    ├── config/
    │   ├── cloudinary.js
    │   └── db.js
    ├── controllers/
    │   ├── adminController.js
    │   ├── authController.js
    │   ├── contactController.js
    │   ├── favoriteController.js
    │   ├── propertyController.js
    │   └── uploadController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── errorMiddleware.js
    │   └── roleMiddleware.js
    ├── models/
    │   ├── ContactMessage.js
    │   ├── Favorite.js
    │   ├── Property.js
    │   └── User.js
    ├── routes/
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── contactRoutes.js
    │   ├── favoriteRoutes.js
    │   ├── propertyRoutes.js
    │   └── uploadRoutes.js
    ├── services/
    │   ├── authService.js
    │   ├── propertyService.js
    │   └── uploadService.js
    ├── utils/
    │   ├── generateToken.js
    │   └── validateEnv.js
```

## Environment Variables

Create a `.env` file with the following values:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## Authentication Flow

### Register

- Endpoint: `POST /api/auth/register`
- Creates a new user
- Hashes the password with bcrypt
- Returns a JWT token

### Login

- Endpoint: `POST /api/auth/login`
- Verifies email and password
- Returns a JWT token

### Get Current User

- Endpoint: `GET /api/auth/me`
- Requires a valid Bearer token

## Property Flow

### Public Routes

- `GET /api/properties` — list published properties with filters and pagination
- `GET /api/properties/:id` — get a single property by id

### Owner Routes

- `POST /api/properties` — create a property
- `GET /api/properties/my/listings` — get owner’s listings
- `PUT /api/properties/:id` — edit a draft property
- `PATCH /api/properties/:id/publish` — publish a draft property
- `PATCH /api/properties/:id/archive` — archive a property
- `DELETE /api/properties/:id` — soft delete a property

## Admin Routes

- `GET /api/admin/properties` — view all properties
- `PATCH /api/admin/properties/:id/disable` — disable a property
- `GET /api/admin/metrics` — get platform metrics

## Favorites

- `GET /api/favorites` — get current user favorites
- `POST /api/favorites/:propertyId` — add a property to favorites
- `DELETE /api/favorites/:propertyId` — remove a property from favorites

## Contact Messages

- `POST /api/contact/:propertyId` — send a message about a published property
- `GET /api/contact/inbox` — get messages received by the owner

## Uploads

- `POST /api/upload` — upload one or more property images
- Uses Cloudinary and returns the uploaded image URLs

## Models

### User

- Stores name, email, password, role, and soft-delete state

### Property

- Stores title, description, location, price, images, status, owner, published date, and soft-delete state

### Favorite

- Stores user-property relationships with a unique index to prevent duplicates

### ContactMessage

- Stores sender, owner, property, and message content

## Notes

- Soft delete is implemented using the `deletedAt` field.
- Published properties are public, while draft and archived properties are restricted to the owner.
- Admin users can disable properties and view platform metrics.
- The API uses centralized error handling for consistent responses.
