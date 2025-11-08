import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../middleware/auth";
import { ExtendError } from "../middleware/error";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();

const querySchema = z.object({
    size: z.string().optional(),
    page: z.string().optional(),
    omitSongs: z.string().optional()
});

const createArtistSchema = z.object({
    name: z.string().min(1),
    songs: z.array(z.object({id: z.number()})).optional()
});

// get specific artist by id
router.get("/get/:id", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(+id)) {
            next(new ExtendError("Invalid artist id!", 400));
            return;
        }
        // find aritst by id
        const artist = await prisma.artist.findUnique({
            where: {
                id: +id
            },
            include: {
                songs: true
            }
        });
        // error, if artist does not exist
        if (!artist) {
            next(new ExtendError("Artist not found!", 404));
            return;
        }
        // return found artist
        res.send(artist);
    } catch(err) {
        next(new ExtendError("Invalid artist id!", 400));
    }
});

// get all artists
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
            skip = take * (+validated.page - 1);
        }
        // query artists
        let artists = null
        if (validated.size && !isNaN(+validated.size) && +validated.size == -1) {
            artists = await prisma.artist.findMany({
                include: {
                    songs: validated.omitSongs === "true" ? false : true
                }, skip
            });
        } else {
            artists = await prisma.artist.findMany({
                include: {
                    songs: validated.omitSongs === "true" ? false : true
                }, take, skip
            });
        }
        // get total count of artists
        const totalItems = await prisma.artist.count();
        const totalPages = Math.ceil(totalItems / take);
        // return found artists
        res.send({artists, totalItems, totalPages});
    } catch(err) {
        next(new ExtendError("Invalid query parameters!", 400));
    }
});

// add artists with name
router.post("/add", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = createArtistSchema.parse(req.body);
        let artist = await prisma.artist.create({
            data: {
                name: validated.name,
                songs: {
                    connect: validated.songs ? validated.songs : []
                }
            }
        });
        res.send(artist);
    } catch(err) {
        next(new ExtendError("Invalid request data!", 400));
    }
});

export default router;