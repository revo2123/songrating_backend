import dotenv from "dotenv";
import express, { Request, Response, Application } from "express";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "localhost",
    user: process.env.MYSQL_CRUD_USER,
    password: process.env.MYSQL_CRUD_USER_PW,
    database: "songrating"
});
db.connect();

app.get("/", (req: Request, res: Response) => {
    db.query("SELECT * FROM songs", (err: any, results: any) => {
        res.json(results[0]);
    });
});

app.listen(port, () => {
    console.log("Server at port: " + port);
});