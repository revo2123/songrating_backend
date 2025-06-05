import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import bcrypt from "bcrypt";
import auth from "../middleware/auth"
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

// get user by token
router.get("/get", auth as any, async (req, res: any) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.body.user.id
        }
    });
    if (!user) return res.status(401).send("Access denied.");
    res.send({
        id: user?.id,
        name: user?.name
    })
});

// add user with name and password
router.post("/add", async (req, res: any) => {
    // check if username is taken
    let user = await prisma.user.findUnique({
        where: {
            name: req.body.name
        }
    });
    if (user) return res.status(401).send("Name taken.");
    // create user, if it does not yet exist
    user = await prisma.user.create({
        data: {
            name: req.body.name,
            password: await bcrypt.hash(req.body.password, 10)
        }
    });
    // return auth-token and user
    res.header("x-auth-token", generateAuthToken(user)).send({
        id: user.id,
        name: user.name
    });
});

// return jwt-token for name and password
router.post("/login", async (req, res: any) => {
    // get user
    let user = await prisma.user.findUnique({
        where: {
            name: req.body.name
        }
    });
    // check if user exists
    if (!user) return res.status(401).send("Access denied.");
    // check if password is correct
    if (!(await bcrypt.compare(req.body.password, user.password))) res.status(401).send("Access denied.");
    // return auth-token and user
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