# Songrating Backend
Multi-User application for rating Songs.

## Setup
1. run `npm i`
2. startup Postgres
3. create Postgres-User
4. copy `.env.example` to new `.env` and adjust settings
5. run `npx prisma db push`

## Startup
run `npm run dev`

## Libraries
Using Express.js as Backend Framework with TypeScript.
Using Bcrypt and Jsonwebtokens for creating AccessTokens for Users.
Using Prisma as ORM.
Postgres DB needs to be set up externally.