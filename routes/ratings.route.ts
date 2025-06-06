import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import auth from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// get specific rating by id
router.get("/get/:id", auth as any, async (req, res: any) => {
    const rating = await prisma.rating.findUnique({
        where: {
            id: +req.params.id
        },
        include: {
            user: true,
            song: true
        },
        omit: {
            userId: true,
            songId: true
        }
    });
    if (!rating) return res.status(404).send("Rating not found.");
    // return found rating
    res.send(rating);
});

// add rating with value, song and user
router.post("/add", auth as any, async (req, res) => {
    const rating = await prisma.rating.create({
        data: {
            value: req.body.value,
            song: {
                connect: { id: req.body.songId }
            },
            user: {
                connect: { id: req.body.userId }
            }
        },
        include: {
            user: true,
            song: true
        }
    });
    // return created rating
    res.send(rating);
});

export default router;