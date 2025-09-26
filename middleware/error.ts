import { NextFunction, Request, Response } from "express";

export function error(err: ExtendError, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    res.status(err.status).send(err.message);
}

export class ExtendError extends Error {
    public status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}