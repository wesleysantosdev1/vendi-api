import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const message = result.error.issues.map(issue => issue.message).join('; ');
        return res.status(400).json({ error: message });
    }
    req.body = result.data;
    return next();
};
