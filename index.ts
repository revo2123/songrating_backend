import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import { error } from "./middleware/error";

import usersRoute from "./routes/users.route"
import songsRoute from "./routes/songs.route";
import artistsRoute from "./routes/artists.route";
import ratingsRoute from "./routes/ratings.route";

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

app.use(cors());

// add router
app.use(express.json());
app.use("/api/users", usersRoute);
app.use("/api/songs", songsRoute);
app.use("/api/artists", artistsRoute);
app.use("/api/ratings", ratingsRoute);

app.use(error);

// setup express-server on port
app.listen(port, () => {
    console.log("Server at port: " + port);
});

// TODO: add error handling for everything...