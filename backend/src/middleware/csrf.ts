import type { NextFunction, Request, Response } from "express";
import { generateCsrfToken } from "../lib/security";
import { isProduction } from "../config";

const CSRF_COOKIE = "twist_csrf";

export const attachCsrfCookie = (req: Request, res: Response, next: NextFunction) => {
  const existing = req.cookies?.[CSRF_COOKIE];
  const token = existing || generateCsrfToken();
  req.csrfTokenValue = token;

  if (!existing) {
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });
  }
  next();
};

export const requireCsrf = (req: Request, res: Response, next: NextFunction) => {
  const expected = req.cookies?.[CSRF_COOKIE];
  const provided = req.headers["x-csrf-token"];
  if (!expected || typeof provided !== "string" || provided !== expected) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  return next();
};
