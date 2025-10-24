import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../middleware/auth";
import { ExtendError } from "../middleware/error";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();

const querySchema = z.object({
    size: z.string().optional(),
    page: z.string().optional()
});

const createRatingSchema = z.object({
    value: z.number().min(1).max(10),
    songId: z.number(),
    user: z.object({id: z.number()})
});

// get specific rating by id
router.get("/get/:id", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(+id)) {
            next(new ExtendError("Invalid rating id!", 400));
            return;
        }
        // find rating by id
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
        // error, if rating does not exist
        if (!rating) {
            next(new ExtendError("Rating not found!", 404));
            return;
        }
        // return found rating
        res.send(rating);
    } catch(err) {
        next(new ExtendError("Invalid rating id!", 400));
    }
});

// get all ratings
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
        // query ratings
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
            }, take, skip
        });
        // get total count of artists
        const totalItems = await prisma.rating.count({
            where: {
                userId: req.body.user.id
            }
        });
        const totalPages = Math.ceil(totalItems / take);
        // return found ratings
        res.send({ratings, totalItems, totalPages});
    } catch(err) {
        next(new ExtendError("Invalid query parameters!", 400));
    }
});

// get specific rating by song
router.get("/getBySong/:id", auth, async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || isNaN(+id)) {
        next(new ExtendError("Invalid rating id!", 400));
        return;
    }
    const ratings = await prisma.rating.findMany({
        where: {
            songId: +id
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
router.post("/add", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = createRatingSchema.parse(req.body);
        // create rating
        const rating = await prisma.rating.create({
            data: {
                value: validated.value,
                song: {
                    connect: { id: validated.songId }
                },
                user: {
                    connect: { id: validated.user.id }
                }
            },
            include: {
                user: true,
                song: true
            }
        });
        // return created rating
        res.send(rating);
    } catch(err) {
        next(new ExtendError("Invalid request data!", 400));
    }
});

export default router;