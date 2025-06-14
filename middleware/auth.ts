import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function(req: Request, res: Response, next: NextFunction): void|any {
    // get token from header, if present
    const token = req.get("x-access-token");
    // if no token is set, dont go on
    if (!token) return res.status(401).send("Access denied.");
    try {
        // verify token and continue
        req.body.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY as any);
        next();
    } catch (ex) {
        // if token is invalid
        res.status(401).send("Access denied.");
    }
}