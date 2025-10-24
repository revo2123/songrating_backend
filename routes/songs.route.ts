import { PrismaClient } from "@prisma/client";
import auth from "../middleware/auth"
import { ExtendError } from "../middleware/error";
import { NextFunction, Request, Response, Router } from "express";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();

const querySchema = z.object({
    size: z.string().optional(),
    page: z.string().optional(),
    omitArtists: z.string().optional()
});

const createSongSchema = z.object({
    title: z.string().min(1),
    artists: z.array(z.object({id: z.number()})).optional()
});

// get specific song by id
router.get("/get/:id", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(+id)) {
            next(new ExtendError("Invalid song id!", 400));
            return;
        }
        // find song by id
        const song = await prisma.song.findUnique({
            where: {
                id: +req.params.id
            },
            include: {
                artists: true
            }
        });
        // error, if song does not exist
        if (!song) {
            next(new ExtendError("Song not found!", 404));
            return;
        }
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
    } catch(err) {
        next(new ExtendError("Invalid song id!", 400));
    }
});

// get all songs
router.get("/getAll", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = querySchema.parse(req.query);
        // set take
        let take = 24;
        if (validated.size && !isNaN(+validated.size)) {
            take = +validated.size;
        }
        // set skip
        let skip = 0;
        if (validated.page && !isNaN(+validated.page)) {
            skip = take * +validated.page;
        }
        // query songs
        const songs = await prisma.song.findMany({
            include: {
                artists: req.query.omitArtists === "true" ? false : true
            }, take, skip
        });
        // get total count of artists
        const totalItems = await prisma.song.count();
        const totalPages = Math.ceil(totalItems / take);
        // return found songs
        res.send({songs, totalItems, totalPages});
    } catch(err) {
        next(new ExtendError("Invalid query parameters!", 400));
    }
});

// add song to the database
router.post("/add", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = createSongSchema.parse(req.body);
        // create song
        let song = await prisma.song.create({
            data: {
                title: validated.title,
                artists: {
                    connect: validated.artists ? validated.artists : []
                }
            }
        });
        // return created song
        res.send(song);
    } catch(err) {
        next(new ExtendError("Invalid request data!", 400));
    }
});

// TODO: add update functionality

export default router;