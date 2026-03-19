import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/jwt";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.auth = { userId: decoded.sub, role: decoded.role as any };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
