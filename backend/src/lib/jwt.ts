import jwt from "jsonwebtoken";
import { config } from "../config";

export interface AccessTokenPayload {
  sub: string;
  role: string;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
}

export const signAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessTtl as any });

export const signRefreshToken = (payload: RefreshTokenPayload) =>
  jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: `${config.jwt.refreshTtlDays}d` as any });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, config.jwt.accessSecret) as AccessTokenPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload;
