import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import auth from "../middleware/auth"

const router = Router();
const prisma = new PrismaClient();

// get specific artist by id
router.get("/get/:id", auth, async (req, res: any) => {
    const artist = await prisma.artist.findUnique({
        where: {
            id: +req.params.id
        },
        include: {
            songs: true
        }
    });
    if (!artist) return res.status(404).send("Artist not found.");
    // return found artist
    res.send(artist);
});

// get all artists
router.get("/getAll", auth, async (req, res) => {
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
router.post("/add", auth, async (req, res: any) => {
    // create artist, if it does not yet exist
    let artist = await prisma.artist.create({
        data: {
            name: req.body.name
        }
    });
    // return created artist
    res.send(artist);
});

// update artist by id
router.put("/update/:id", auth, async (req, res: any) => {
    const artist = await prisma.artist.update({
        where: {
            id: +req.params.id
        },
        data: {
            name: req.body.name
        }
    });
    if (!artist) return res.status(404).send("Artist not found.");
    // return updated artist
    res.send(artist);
});

export default router;