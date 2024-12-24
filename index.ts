import dotenv from "dotenv";
import express, { Application } from "express";
import { PrismaClient } from "@prisma/client";
import usersRoute from "./routes/users.route"

dotenv.config();

// setup express-server
const app: Application = express();
const port = process.env.PORT || 8000;
// setup prisma
const prisma = new PrismaClient();

// if no private key is set, stop process
if (!process.env.JWT_PRIVATE_KEY) {
    console.log("No JWT_PRIVATE_KEY found.");
    process.exit(1);
}

// add router
app.use(express.json());
app.use("/api/users", usersRoute);

// setup express-server on port
app.listen(port, () => {
    console.log("Server at port: " + port);
});