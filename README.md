# Song Rating Backend API

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)
![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)
![Prisma](https://img.shields.io/badge/Prisma-6.1-2D3748.svg?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12%2B-336791.svg?logo=postgresql)

A RESTful API backend for a multi-user song rating application built with Express.js, TypeScript, and PostgreSQL. Users can create accounts, add songs and artists, and rate songs on a scale of 1-10.

## 🎯 Features

- **User Authentication**: JWT-based authentication system
- **Song Management**: Create and retrieve songs with associated artists
- **Artist Management**: Manage artists and their associated songs
- **Rating System**: Users can rate songs (1-10 scale) with unique constraint per user per song
- **Pagination**: Built-in pagination support for list endpoints
- **Input Validation**: Zod-based request validation
- **Password Security**: Bcrypt hashing for secure password storage
- **Type Safety**: Full TypeScript implementation with Prisma ORM

## 📋 Prerequisites

- **Node.js** (v18 or higher recommended)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn** package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/revo2123/songrating_backend.git
cd songrating_backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up PostgreSQL Database

Create a PostgreSQL database and user:

```sql
CREATE DATABASE songrating_db;
CREATE USER songrating_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE songrating_db TO songrating_user;
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://songrating_user:your_password@localhost:5432/songrating_db?schema=public"

# Server
PORT=8000

# JWT Configuration
JWT_PRIVATE_KEY=your_super_secret_jwt_key_here_minimum_32_characters
JWT_EXPIRY=14d
```

**Important**: 
- Replace `your_super_secret_jwt_key_here_minimum_32_characters` with a strong, random secret key
- The `JWT_PRIVATE_KEY` is required - the server will not start without it
- Use a secure, randomly generated string for production environments

### 5. Initialize Database Schema

```bash
npx prisma db push
```

Or use migrations for production:

```bash
npx prisma migrate dev --name init
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:8000` (or the port specified in `.env`).

## 📁 Project Structure

```
songrating_backend/
├── index.ts                 # Application entry point
├── middleware/
│   ├── auth.ts             # JWT authentication middleware
│   └── error.ts            # Global error handler
├── routes/
│   ├── users.route.ts      # User authentication routes
│   ├── songs.route.ts      # Song CRUD routes
│   ├── artists.route.ts    # Artist CRUD routes
│   └── ratings.route.ts    # Rating CRUD routes
├── prisma/
│   └── schema.prisma       # Database schema definition
├── package.json
├── tsconfig.json
└── .env                    # Environment variables (create this)
```

## 🔌 API Endpoints

All endpoints are prefixed with `/api`.

### Authentication

#### Register User
```http
POST /api/users/add
Content-Type: application/json

{
  "name": "username",
  "password": "password123"
}
```

**Response**: 
- Headers: `x-auth-token` (JWT token)
- Body: `{ "id": 1, "name": "username" }`

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "name": "username",
  "password": "password123"
}
```

**Response**: 
- Headers: `x-auth-token` (JWT token)
- Body: `{ "id": 1, "name": "username" }`

#### Get User by ID
```http
GET /api/users/get/:id
Headers: x-access-token: <JWT_TOKEN>
```

**Response**: `{ "id": 1, "name": "username" }`

### Songs

#### Get All Songs
```http
GET /api/songs/getAll?size=24&page=0&omitArtists=false
Headers: x-access-token: <JWT_TOKEN>
```

**Query Parameters**:
- `size` (optional): Number of items per page (default: 24)
- `page` (optional): Page number (default: 0)
- `omitArtists` (optional): Set to `"true"` to exclude artists from response

#### Get Song by ID
```http
GET /api/songs/get/:id
Headers: x-access-token: <JWT_TOKEN>
```

**Response**: Includes song details, artists, average rating, and rating count.

#### Create Song
```http
POST /api/songs/add
Headers: x-access-token: <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Song Title",
  "artists": [{ "id": 1 }]  // Optional
}
```

### Artists

#### Get All Artists
```http
GET /api/artists/getAll?size=24&page=1&omitSongs=false
Headers: x-access-token: <JWT_TOKEN>
```

**Response**: 
```json
{
  "artists": [...],
  "totalPages": 5
}
```

#### Get Artist by ID
```http
GET /api/artists/get/:id
Headers: x-access-token: <JWT_TOKEN>
```

#### Create Artist
```http
POST /api/artists/add
Headers: x-access-token: <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Artist Name",
  "songs": [{ "id": 1 }]  // Optional
}
```

### Ratings

#### Get All Ratings (Current User)
```http
GET /api/ratings/getAll?size=24&page=0
Headers: x-access-token: <JWT_TOKEN>
```

**Note**: Returns only ratings for the authenticated user.

#### Get Rating by ID
```http
GET /api/ratings/get/:id
Headers: x-access-token: <JWT_TOKEN>
```

#### Get Ratings by Song
```http
GET /api/ratings/getBySong/:songId
Headers: x-access-token: <JWT_TOKEN>
```

**Response**: Array of rating values `[8, 9, 7, 10]`

#### Create Rating
```http
POST /api/ratings/add
Headers: x-access-token: <JWT_TOKEN>
Content-Type: application/json

{
  "value": 8,  // 1-10
  "songId": 1
}
```

**Note**: Each user can only rate a song once (unique constraint). Updating a rating requires deleting and recreating it.

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `x-access-token` header for protected routes:

```http
x-access-token: <your_jwt_token>
```

Tokens are returned in the `x-auth-token` header when registering or logging in.

## 🛠️ Available Scripts

```bash
# Development mode with hot-reload (nodemon)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

## 🗄️ Database Schema

### Models

- **User**: `id`, `name` (unique), `password` (hashed), `rating[]`
- **Song**: `id`, `title`, `artists[]`, `ratings[]`
- **Artist**: `id`, `name`, `songs[]`
- **Rating**: `id`, `value` (1-10), `songId`, `userId`, unique constraint on `(songId, userId)`

### Database Management

```bash
# Push schema changes to database (development)
npx prisma db push

# Create migration (production)
npx prisma migrate dev --name <migration_name>

# View database in Prisma Studio
npx prisma studio

# Generate Prisma Client after schema changes
npx prisma generate
```

## 🧪 Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Modern ORM for database access
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing

## 🔧 Development

### Type Checking

```bash
npx tsc --noEmit
```

### Prisma Studio

Visual database browser:

```bash
npx prisma studio
```

Opens at `http://localhost:5555`

## 🚨 Error Handling

The API uses a centralized error handler. Errors are returned with appropriate HTTP status codes:

- `400` - Bad Request (validation errors, invalid parameters)
- `401` - Unauthorized (authentication required or failed)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

Error response format:
```json
{
  "message": "Error message here"
}
```

## 📝 Notes

- **Password Security**: Passwords are hashed using bcrypt with 10 salt rounds
- **JWT Expiry**: Token expiration is configurable via `JWT_EXPIRY` environment variable
- **CORS**: Currently allows all origins. Configure for production use.
- **Rate Limiting**: Not currently implemented. Consider adding for production.

## 🔐 Security Recommendations

For production deployment:

1. **Environment Variables**: Never commit `.env` files. Use secure secret management.
2. **CORS**: Configure allowed origins instead of allowing all.
3. **Rate Limiting**: Implement rate limiting on authentication endpoints.
4. **HTTPS**: Always use HTTPS in production.
5. **JWT Secret**: Use a strong, randomly generated secret key (minimum 32 characters).
6. **Password Policy**: Consider implementing password strength requirements.
7. **Input Validation**: Already implemented with Zod, but review for edge cases.

## 📄 License

MIT

## 👤 Author

pg

---

For the frontend application, see the `songrating_frontend` repository.
