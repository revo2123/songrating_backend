import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import auth from "../middleware/auth"

const router = Router();
const prisma = new PrismaClient();

// get specific song by id
router.get("/get/:id", auth, async (req, res: any) => {
    // get song
    const song = await prisma.song.findUnique({
        where: {
            id: +req.params.id
        },
        include: {
            artists: true
        }
    });
    // error, if song does not exist
    if (!song) return res.status(404).send("Song not found.");
    // get avg and count for ratings of song
    const agg = await prisma.rating.aggregate({
        _avg: {
            value: true
        },
        _count: {
            value: true
        },
        where: {
            songId: +req.params.id
        }
    });
    // return found song and aggregation data
    res.send({...song, ratingAvg: agg._avg.value, ratingCount: agg._count.value});
});

// get all songs
router.get("/getAll", auth, async (req, res) => {
    const songs = await prisma.song.findMany({
        include: {
            artists: req.query.omitArtists === "true" ? false : true
        },
        take: req.query.limit ? +req.query.limit : 24
    });
    // return found songs
    res.send(songs);
});

// add song with title, link and artist
router.post("/add", auth, async (req, res) => {
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
router.put("/update/:id", auth, async (req, res: any) => {
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