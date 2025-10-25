# Song Rating Backend
The backend API for the Song Rating platform. Handles all data management, authentication, and business logic for rating and organizing music collections.

## 🎵 About the Project

This Express.js application provides the REST API for the Song Rating platform. It manages artists, songs, ratings, and user data with a PostgreSQL database and Prisma ORM.

### Features

- ✅ Artist management (CRUD operations)
- ✅ Song management with artist associations
- ✅ User rating system
- ✅ User authentication with JWT
- ✅ RESTful API architecture
- 🚧 More features in development

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **Security:** bcrypt for password hashing
- **Development:** nodemon, ts-node-dev

## 📋 Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn
- PostgreSQL database

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/revo2123/songrating_backend.git
cd songrating_backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration. Required variables can be found in `.env.example`.

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:8000` (or the port specified in your `.env` file).

## 📦 Build & Run

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 🔌 API Endpoints

The API provides the following main endpoints:

- **`/artists`** - Artist management
- **`/songs`** - Song management
- **`/ratings`** - Rating operations
- **`/users`** - User management and authentication

For detailed API documentation, see the endpoint implementations or set up API documentation tools.

## 🏗️ Project Structure

```
songrating_backend/
├── prisma/
│   └── schema.prisma    # Database schema
├── src/
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   └── utils/           # Helper functions
├── .env.example         # Environment variables template
├── index.ts             # Application entry point
└── package.json
```

## 🔐 Environment Variables

Required environment variables (see `.env.example` for details):

- `PORT` - Server port (default: 8000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens

## 🗄️ Database

This application uses PostgreSQL with Prisma as the ORM. 

## 🔗 Frontend

This backend works with the corresponding frontend application.  
Frontend repository: https://github.com/revo2123/songrating_frontend

## 🤝 Contributing

This project is still in early development. Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is currently without a license. Please contact for usage inquiries.

## 📌 Status

⚠️ **In Development** - This project is under active development. Features and API may still change. Please inform me of feature wishes.

---

⭐ If you like this project, give it a star on GitHub!