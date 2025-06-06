import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import auth from "../middleware/auth"

const router = Router();
const prisma = new PrismaClient();

// get specific song by id
router.get("/get/:id", auth as any, async (req, res: any) => {
    const song = await prisma.song.findUnique({
        where: {
            id: +req.params.id
        }
    });
    if (!song) return res.status(404).send("Song not found.");
    // return found song
    res.send(song);
});

// get all songs
router.get("/getAll", auth as any, async (req, res) => {
    const songs = await prisma.song.findMany({
        include: {
            artists: true
        }
    });
    // return found songs
    res.send(songs);
});

// add song with title, link and artist
router.post("/add", auth as any, async (req, res) => {
    const song = await prisma.song.create({
        data: {
            title: req.body.title,
            link: req.body.link,
            artists: {
                connect: req.body.artists.map((artistId: number) => ({ id: artistId }))
            }
        }
    });
    // return created song
    res.send(song);
});

// update song by id
router.put("/update/:id", auth as any, async (req, res: any) => {
    const song = await prisma.song.update({
        where: {
            id: +req.params.id
        },
        data: {
            title: req.body.title,
            link: req.body.link,
            artists: {
                set: req.body.artists.map((artistId: number) => ({ id: artistId }))
            }
        }
    });
    if (!song) return res.status(404).send("Song not found.");
    // return updated song
    res.send(song);
});

export default router;