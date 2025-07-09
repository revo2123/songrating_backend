import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import auth from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// get specific rating by id
router.get("/get/:id", auth, async (req, res: any) => {
    const rating = await prisma.rating.findUnique({
        where: {
            id: +req.params.id
        },
        include: {
            user: true,
            song: {
                include: {
                    artists: true 
                }
            }
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

// get all ratings
router.get("/getAll", auth, async (req, res) => {
    const ratings = await prisma.rating.findMany({
        where: {
            userId: req.body.user.id
        },
        include: {
            song: true
        },
        omit: {
            userId: true,
            songId: true
        },
        take: req.query.limit ? +req.query.limit : 24
    });
    // return found ratings
    res.send(ratings);
});

// get specific rating by song
router.get("/getBySong/:id", auth, async (req, res: any) => {
    const ratings = await prisma.rating.findMany({
        where: {
            songId: +req.params.id
        },
        omit: {
            userId: true,
            songId: true,
            id: true
        }
    });
    const ratingArr = ratings.map((rating) => rating.value);
    // return found ratings
    res.send(ratingArr);
});

// add rating with value, song and user
router.post("/add", auth, async (req, res) => {
    const rating = await prisma.rating.create({
        data: {
            value: req.body.value,
            song: {
                connect: { id: req.body.songId }
            },
            user: {
                connect: { id: req.body.user.id }
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