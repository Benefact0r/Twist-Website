import type { NextFunction, Request, Response } from "express";
import { verifyCsrfToken } from "../lib/csrfToken";

/**
 * Validates `x-csrf-token` using an HMAC-signed token from GET /csrf.
 * Does not rely on cookies (iOS WebKit often blocks cross-site CSRF cookies).
 */
export const requireCsrf = (req: Request, res: Response, next: NextFunction) => {
  const provided = req.headers["x-csrf-token"];
  if (typeof provided !== "string" || !verifyCsrfToken(provided)) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  return next();
};
