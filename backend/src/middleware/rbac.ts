import type { UserRole } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.auth?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return next();
  };
};
