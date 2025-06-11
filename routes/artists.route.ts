import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import auth from "../middleware/auth"

const router = Router();
const prisma = new PrismaClient();

// get specific artist by id
router.get("/get/:id", auth as any, async (req, res: any) => {
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
router.get("/getAll", auth as any, async (req, res) => {
    const artists = await prisma.artist.findMany({
        include: {
            songs: req.query.omitSongs === "true" ? false : true
        }
    });
    // return found artists
    res.send(artists);
});

// add artists with name
router.post("/add", auth as any, async (req, res: any) => {
    // check if artist already exists
    let artist = await prisma.artist.findUnique({
        where: {
            name: req.body.name
        }
    });
    if (artist) return res.status(401).send("Artist already exists.");
    // create artist, if it does not yet exist
    artist = await prisma.artist.create({
        data: {
            name: req.body.name,
            link: req.body.link
        }
    });
    // return created artist
    res.send(artist);
});

// update artist by id
router.put("/update/:id", auth as any, async (req, res: any) => {
    const artist = await prisma.artist.update({
        where: {
            id: +req.params.id
        },
        data: {
            name: req.body.name,
            link: req.body.link
        }
    });
    if (!artist) return res.status(404).send("Artist not found.");
    // return updated artist
    res.send(artist);
});

export default router;