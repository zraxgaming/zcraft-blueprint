import { NextFunction, Request, Response } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Example: check for a session or token
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token || token !== process.env.RSS_AUTH_TOKEN) {
    return res.status(401).send("Unauthorized");
  }
  next();
}
