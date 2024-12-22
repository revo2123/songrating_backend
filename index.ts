import dotenv from "dotenv";
import express, { Express, Request, Response, Application } from "express";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "localhost",
    user: "workbench",
    password: "workbench",
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