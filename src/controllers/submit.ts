import { Response, Request, NextFunction } from "express";

export const submit = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({ message: "Success" });
    } catch (error) {
        next(error);
    }
};
