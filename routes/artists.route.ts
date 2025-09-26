import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../middleware/auth";
import { ExtendError } from "../middleware/error";

const router = Router();
const prisma = new PrismaClient();

// get specific artist by id
router.get("/get/:id", auth, async (req: Request, res: Response, next: NextFunction) => {
    const artist = await prisma.artist.findUnique({
        where: {
            id: +req.params.id
        },
        include: {
            songs: true
        }
    });
    if (!artist) {
        next(new ExtendError("Artist not found!", 404));
        return;
    }
    // return found artist
    res.send(artist);
});

// get all artists
router.get("/getAll", auth, async (req: Request, res: Response) => {
    const artists = await prisma.artist.findMany({
        include: {
            songs: req.query.omitSongs === "true" ? false : true
        },
        take: req.query.limit ? +req.query.limit : 24
    });
    // return found artists
    res.send(artists);
});

// add artists with name
router.post("/add", auth, async (req: Request, res: Response) => {
    // create artist, if it does not yet exist
    let artist = await prisma.artist.create({
        data: {
            name: req.body.name,
            songs: {
                connect: req.body.songs ? req.body.songs : []
            }
        }
    });
    // return created artist
    res.send(artist);
});

// update artist by id
router.put("/update/:id", auth, async (req: Request, res: Response, next: NextFunction) => {
    const artist = await prisma.artist.update({
        where: {
            id: +req.params.id
        },
        data: {
            name: req.body.name
        }
    });
    if (!artist) {
        next(new ExtendError("Artist not found!", 404));
        return;
    }
    // return updated artist
    res.send(artist);
});

export default router;