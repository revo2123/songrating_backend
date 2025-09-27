import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import auth from "../middleware/auth";
import jwt from "jsonwebtoken";
import { ExtendError } from "../middleware/error";

const router = Router();
const prisma = new PrismaClient();

// get user by token
router.get("/get/:id", auth, async (req: Request, res: Response, next: NextFunction) => {
    // get specific user by id
    const user = await prisma.user.findUnique({
        where: {
            id: +req.params.id
        }
    });
    if (!user) {
        next(new ExtendError("Access denied!", 401));
        return;
    }
    // return found user
    res.send({
        id: user.id,
        name: user.name
    })
});

// add user with name and password
router.post("/add", async (req: Request, res: Response, next: NextFunction) => {
    // check if username is taken
    let user = await prisma.user.findUnique({
        where: {
            name: req.body.name
        }
    });
    if (user) {
        next(new ExtendError("Name taken!", 401));
        return;
    }
    // create user, if it does not yet exist
    user = await prisma.user.create({
        data: {
            name: req.body.name,
            password: await bcrypt.hash(req.body.password, 10)
        }
    });
    // return auth-token and user
    res.header("Access-Control-Expose-Headers", "x-auth-token");
    res.header("x-auth-token", generateAuthToken(user)).send({
        id: user.id,
        name: user.name
    });
});

// return jwt-token for name and password
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    // get user
    let user = await prisma.user.findUnique({
        where: {
            name: req.body.name
        }
    });
    // check if user exists and password is correct
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        next(new ExtendError("Incorrect Password or Username!", 401));
        return;
    }
    // return auth-token and user
    res.header("Access-Control-Expose-Headers", "x-auth-token");
    res.header("x-auth-token", generateAuthToken(user)).send({
        id: user.id,
        name: user.name
    });
});

/**
 * generate jwt token
 * @param user the user-object
 * @returns auth-token
 */
function generateAuthToken(user: {id: number, name: string, password: string}): string {
    return jwt.sign({id: user.id}, process.env.JWT_PRIVATE_KEY as any, {expiresIn: process.env.JWT_EXPIRY as any});
}

export default router;
// module.exports = router;