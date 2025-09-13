import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import auth from "../middleware/auth"
import axios from "axios";

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

// add song to the database
router.post("/add", auth, async (req, res: any) => {
    // create song
    let song = await prisma.song.create({
        data: {
            title: req.body.title,
            artists: {
                connect: req.body.artists ? req.body.artists : []
            }
        }
    });
    // return created song
    res.send(song);
});

// TODO: add update functionality

export default router;